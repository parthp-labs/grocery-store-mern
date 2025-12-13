import { asyncErrorHandler } from "../middlewares/errorHandler.js";
import { Order } from "../models/Orders.js";
import { stripe } from "../app.js";
import CustomError from "../utils/utilityClasses.js";
import { Item } from "../models/Item.js";
import mongoose from "mongoose";
import { generateInvoice } from "../utils/features.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";
import {
  sendOrderCancelledByCustomerEmail,
  sendOrderDeliveredEmail,
  sendOrderPlacedEmail,
} from "../utils/sendEmail.js";

// GET ALL ORDERS OF A USER
export const getAllUserOrders = asyncErrorHandler(async (req, res, next) => {
  const { orderId, minAmount, maxAmount, fromDate, toDate, status } = req.query;

  // Creating a filter
  const filterQuery = {
    user: req.user._id,
  };

  if (status && status.trim() !== "") {
    if (
      !["all", "processing", "pending", "cancelled", "delivered"].includes(
        status
      )
    ) {
      return next(
        new CustomError(
          "Please show order status from 'processing', 'pending', 'delivered' or 'cancelled'",
          409
        )
      );
    } else {
      if (status !== "all") {
        filterQuery.status = status;
      }
    }
  }

  if (orderId && orderId.trim() !== "") {
    filterQuery._id = orderId;
  } else {
    if (minAmount || maxAmount) {
      filterQuery.totalAmount = {};

      if (minAmount) {
        filterQuery.totalAmount["$gte"] = Number(minAmount);
      }
      if (maxAmount) {
        filterQuery.totalAmount["$lte"] = Number(maxAmount);
      }
    }

    if (toDate || fromDate) {
      filterQuery.orderedOn = {};

      if (fromDate) {
        filterQuery.orderedOn["$gte"] = new Date(fromDate);
      }
      if (toDate) {
        filterQuery.orderedOn["$gte"] = new Date(toDate);
      }
    }
  }

  console.log(filterQuery);

  const orders = await Order.find(filterQuery).select("-sessionId");

  res.status(200).json({
    success: true,
    order: orders,
  });
});

// GET ALL ORDERS
export const getAllOrders = asyncErrorHandler(async (req, res, next) => {
  const { id, userId, status } = req.query;

  // Creating a filter query as per given parameters
  const filterQuery = {};

  if (id) filterQuery._id = mongoose.Schema.ObjectId(id);
  if (status) filterQuery.status = status;

  const orders = await Order.find(filterQuery).populate("user");

  res.status(200).json({
    success: true,
    order: orders,
  });
});

// GET SINGLE ORDER
export const getSingleOrder = asyncErrorHandler(async (req, res, next) => {
  const reqOrder = await Order.findById(req.params.orderId).select(
    "-sessionId"
  );

  if (!reqOrder) {
    return next(new CustomError("No order found", 404));
  }

  res.status(200).json({
    success: true,
    order: reqOrder,
  });
});

// UPDATE ORDER STATUS
export const updateOrderStatus = asyncErrorHandler(async (req, res, next) => {
  const { status } = req.body;

  const reqOrder = await Order.findById(req.params.orderId)
    .select("-sessionId")
    .populate("user");

  if (!reqOrder) {
    return next(new CustomError("No order found", 404));
  }

  if (!status) {
    return next(new CustomError("Please provide a valid order status", 409));
  }

  if (status !== "delivered" && status !== "cancelled") {
    return next(
      new CustomError(
        "Order status can only be set to 'delivered' or 'cancelled'"
      )
    );
  } else if (status === reqOrder.status) {
    return next(
      new CustomError(`Order status is already set to '${status}'`, 409)
    );
  }

  reqOrder.status = status;
  reqOrder.deliveredOn = Date.now();
  await reqOrder.save();

  if (reqOrder.status == "delivered") {
    const sendEmail = await sendOrderDeliveredEmail({
      name: reqOrder.user.name,
      orderId: reqOrder._id,
      address: Object.values(reqOrder.deliveryAddress).join(", "),
      to: reqOrder.user.email,
      totalAmount: reqOrder.totalAmount,
    });

    if (!sendEmail) {
      return res.status(200).json({
        success: true,
        emailSent: false,
        message:
          "Order status successfully changed to delivered. But email was not sent to the customer",
      });
    }
  }

  res.status(200).json({
    success: true,
    message: "Order status has been updated",
    order: reqOrder,
  });
});

// DELETE ORDER
export const deleteOrder = asyncErrorHandler(async (req, res, next) => {
  const reqOrder = await Order.findById(req.params.orderId);

  if (!reqOrder) {
    return next(new CustomError("No order found", 404));
  }

  await reqOrder.deleteOne();

  res.status(200).json({
    success: true,
    message: "Order has been deleted",
  });
});

// PLACE NEW ORDER
export const newOrder = asyncErrorHandler(async (req, res, next) => {
  const {
    orderItems,
    houseNumber,
    streetInfo,
    city,
    state,
    pinCode,
    totalAmount,
    subTotal,
    deliveryCharges,
    tax,
    paymentMode,
    successRedirectUrl,
    failRedirectUrl,
  } = req.body;

  // if (
  //   !orderItems ||
  //   !houseNumber ||
  //   !streetInfo ||
  //   !city ||
  //   !state ||
  //   !pinCode ||
  //   !subTotal ||
  //   !deliveryCharges ||
  //   !tax ||
  //   !totalAmount ||
  //   !successRedirectUrl ||
  //   !failRedirectUrl ||
  //   !paymentMode
  // ) {
  //   return next(
  //     new CustomError(
  //       "Please provide a valid orderItems, houseNumber, streetInfo, city, state, pinCode, totalAmount, subTotal, deliveryCharges, tax, successRedirectUrl, failRedirectUrl & paymentMode",
  //       409
  //     )
  //   );
  // }

  if (!["cashOnDelivery", "card"].includes(paymentMode)) {
    return next(
      new CustomError("Payment mode can only be cashOnDelivery or online")
    );
  }

  // Making list of items as per requirement for checkout session and order schema and checking if items are in stock
  let lineItems = [];
  let outOfStockItems = [];
  let updatedOrderItems = [];

  await Promise.all(
    orderItems.map(async (item) => {
      const reqItem = await Item.findById(item.itemId);

      if (!reqItem) {
        return next(
          new CustomError(`No item found with id: ${item.itemId}`, 404)
        );
      }

      // Checking if item is in stock
      if (reqItem.stock < item.quantity) {
        outOfStockItems.push(reqItem.name);
      }

      lineItems.push({
        price_data: {
          currency: "inr",
          product_data: {
            name: reqItem.name,
            images: [reqItem.images[0]],
          },
          unit_amount: reqItem.discountedPrice * 100,
        },
        quantity: item.quantity,
      });

      console.log(typeof reqItem.category);
      updatedOrderItems.push({
        itemId: reqItem.id,
        quantity: item.quantity,
        name: reqItem.name,
        description: reqItem.description,
        category: reqItem.category,
        originalPrice: reqItem.originalPrice,
        discountedPrice: reqItem.discountedPrice,
        discount: reqItem.discount,
        images: reqItem.images,
        weight: reqItem.weight,
        rating: reqItem.rating,
      });
    })
  );

  // Cancelling order request when out of stock items are found in the orderItems
  if (outOfStockItems.length !== 0) {
    let msg = "Item ";

    outOfStockItems.forEach((item) => {
      msg += `'${item}'`;

      if (outOfStockItems.indexOf(item) == outOfStockItems.length - 2) {
        msg += " & ";
      } else if (outOfStockItems.indexOf(item) !== outOfStockItems.length - 1) {
        msg += ", ";
      } else {
        msg += " ";
      }
    });

    msg += "is out of stock";

    return next(new CustomError(msg, 409));
  }

  // Creating a new order with pending status and checking if it is a valid order
  const newOrder = new Order({
    user: req.user._id,
    orderItems: updatedOrderItems,
    deliveryAddress: { houseNumber, streetInfo, city, state, pinCode },
    subTotal,
    tax,
    totalAmount,
    deliveryCharges,
    sessionId: "default",
  });

  await newOrder.validate();

  if (paymentMode === "cashOnDelivery") {
    newOrder.status = "processing";
    newOrder.payment = { paymentMode: "cashOnDelivery" };

    await newOrder.save();

    // Generating invoice
    console.log("Invoice Generation in COD");
    await generateInvoice({
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      phoneNumber: req.user.phoneNumber,
      email: req.user.email,
      houseNumber: req.user.houseNumber,
      streetInfo: req.user.streetInfo,
      city: req.user.city,
      pinCode: req.user.pinCode,
      state: req.user.state,
      discount: 0,
      totalAmount: newOrder.totalAmount,
      subTotal: newOrder.subTotal,
      orderId: newOrder._id,
      orderItems: newOrder.orderItems,
      orderPlacedOn: newOrder.orderedOn,
      paymentMode: newOrder.payment.paymentMode,
      deliveryCharges: newOrder.deliveryCharges,
    });

    // Sending the verification code to user via email
    const sendEmail = await sendOrderPlacedEmail({
      name: `${req.user.firstName} ${req.user.lastName}`,
      to: req.user.email,
      items: newOrder.orderItems,
      orderId: newOrder._id,
      total: newOrder.totalAmount,
      totalItems: newOrder.orderItems.length,
    });

    // Sending response when email was not sent
    if (!sendEmail) {
      return res.status(201).json({
        success: true,
        emailSent: false,
        order: newOrder,
        message:
          "Your order was placed, but the system was unable to send email.",
      });
    }

    return res.status(201).json({
      success: true,
      emailSent: true,
      message: "Your order has been placed",
      order: newOrder,
    });
  } else {
    // Creating a payment session for card payment
    const customer = await stripe.customers.create({
      name: `${req.user.firstName} ${req.user.lastName}`,
      address: {
        line1: houseNumber,
        line2: streetInfo,
        city: city,
        state: state,
        postal_code: pinCode,
        country: "India",
      },
      email: req.user.email,
      phone: req.user.phoneNumber,
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `http://${process.env.HOST}:${process.env.PORT}/api/v1/orders/payment/success?session_id={CHECKOUT_SESSION_ID}&redirect_to=${successRedirectUrl}`,
      cancel_url: `http://${process.env.HOST}:${process.env.PORT}/api/v1/orders/payment/fail?session_id={CHECKOUT_SESSION_ID}&redirect_to=${failRedirectUrl}`,
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
      customer: customer.id,

      billing_address_collection: "auto",
    });

    // Saving the pending order
    newOrder.sessionId = session.id;
    newOrder.payment = { paymentMode: "card" };
    await newOrder.save();

    // Generating invoice
    console.log("Invoice Generation");
    await generateInvoice({
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      phoneNumber: req.user.phoneNumber,
      email: req.user.email,
      houseNumber: req.user.houseNumber,
      streetInfo: req.user.streetInfo,
      city: req.user.city,
      pinCode: req.user.pinCode,
      state: req.user.state,
      discount: 0,
      totalAmount: newOrder.totalAmount,
      subTotal: newOrder.subTotal,
      orderId: newOrder._id,
      orderItems: newOrder.orderItems,
      orderPlacedOn: newOrder.orderedOn,
      paymentMode: newOrder.payment.paymentMode,
      deliveryCharges: newOrder.deliveryCharges,
    });

    // Sending the link of checkout session to the frontend
    res.status(200).json({
      paymentLink: session.url,
      message: "Please continue to the provided link for payment",
    });
  }
});

// ORDER SUCCESS
export const orderSuccess = asyncErrorHandler(async (req, res, next) => {
  const sessionId = req.query.session_id;
  const redirectTo = req.query.redirect_to;

  // Changing the status of the placed order from pending to processing
  const reqOrder = await Order.findOne({ sessionId });

  reqOrder.status = "processing";
  reqOrder.payment = { ...reqOrder.payment, status: "success" };

  await reqOrder.save();

  // Redirecting the user to the provided success page url
  res.redirect(`${redirectTo}?orderId=${reqOrder._id}`);
});

// ORDER FAIL
export const orderFail = asyncErrorHandler(async (req, res, next) => {
  const sessionId = req.query.session_id;
  const redirectTo = req.query.redirect_to;

  // Changing the status of the placed order from pending to processing
  const reqOrder = await Order.findOne({ sessionId });

  reqOrder.status = "cancelled";
  reqOrder.payment = { ...reqOrder.payment, status: "failed" };

  await reqOrder.save();

  // Redirecting the user to the provided success page url
  res.redirect(`${redirectTo}?orderId=${reqOrder._id}`);
});

// CANCEL ORDER
export const cancelOrder = asyncErrorHandler(async (req, res, next) => {
  // Checking if order exists
  const reqOrder = await Order.findById(req.params.orderId).populate("user");

  if (!reqOrder) {
    return next(new CustomError("No order found", 404));
  }

  // Checking if order is not already delivered or cancelled
  if (reqOrder.status === "delivered") {
    return next(new CustomError("Order has already been delivered", 409));
  }
  if (reqOrder.status === "cancelled") {
    return next(new CustomError("Order has already been cancelled", 409));
  }

  // Cancelling the order
  reqOrder.status = "cancelled";
  await reqOrder.save();

  if (req.user.role == "user") {
    const sendEmail = await sendOrderCancelledByCustomerEmail({
      to: reqOrder.user.email,
      name: reqOrder.user.name,
      orderId: reqOrder._id,
      items: reqOrder.orderItems,
      total: reqOrder.totalAmount,
    });

    return res.status(200).json({
      success: true,
      message: "Order has been cancelled",
      order: reqOrder,
      mailSent: sendEmail,
    });
  }

  res.status(200).json({
    success: true,
    message: "Order has been cancelled",
    order: reqOrder,
  });
});

// DOWNLOAD ORDER INVOICE
export const downloadOrderInvoice = asyncErrorHandler(
  async (req, res, next) => {
    const orderId = req.params.orderId;

    const reqOrder = await Order.findById(orderId);

    if (!reqOrder) {
      return next(new CustomError("No order found", 404));
    }

    // Checking if the order owner is trying to download the invoice
    if (reqOrder.user._id.toString() !== req.user._id.toString()) {
      return next(
        new CustomError("You are not authorized to access this resource", 409)
      );
    }

    const __dirname = dirname(URLToPath(import.meta.url));
    const invoicePath = path.join(
      __dirname,
      "..",
      "public",
      "invoices",
      `order${orderId}.xlsx`
    );

    if (!existsSync(invoicePath))
      return next(new CustomError("Invoice file not found", 404));
    res.setHeader(
      "Content-disposition",
      `attachment; filename="order${orderId}.xlsx"`
    );

    res.download(invoicePath, `order${orderId}.xlsx`, (err) => {
      if (err) {
        console.log("Error downloading invoice");
        return next(new CustomError(err, 500));
      }
    });
  }
);
