import { asyncErrorHandler } from "../middlewares/errorHandler.js";
import { stripe } from "../app.js";
import CustomError from "../utils/utilityClasses.js";
import { Item } from "../models/Item.js";
import { Order } from "../models/Orders.js";

// MAKING PAYMENT CHECKOUT SESSION
export const makePayment = asyncErrorHandler(async (req, res, next) => {
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
    successRedirectUrl,
    failRedirectUrl,
  } = req.body;

  if (
    !orderItems ||
    !houseNumber ||
    !streetInfo ||
    !city ||
    !state ||
    !pinCode ||
    !subTotal ||
    !deliveryCharges ||
    !tax ||
    !totalAmount ||
    !successRedirectUrl ||
    !failRedirectUrl
  ) {
    return next(
      new CustomError(
        "Please provide a valid orderItems, houseNumber, streetInfo, city, state, pinCode, totalAmount, subTotal, deliveryCharges, tax, successRedirectUrl, failRedirectUrl",
        409
      )
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

  // Creating customer and checkout session
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
    success_url: `http://${process.env.HOST}:${process.env.PORT}/api/v1/orders/success?session_id={CHECKOUT_SESSION_ID}&redirect_to=${successRedirectUrl}`,
    cancel_url: `http://${process.env.HOST}:${process.env.PORT}/api/v1/orders/fail?session_id={CHECKOUT_SESSION_ID}&redirect_to=${failRedirectUrl}`,
    line_items: lineItems,
    shipping_address_collection: {
      allowed_countries: ["IN"],
    },
    customer: customer.id,

    billing_address_collection: "auto",
  });

  // Saving the pending order
  newOrder.sessionId = session.id;
  await newOrder.save();

  // Sending the link of checkout session to the frontend
  res.status(200).json({ url: session.url });
});

// FOR LISTENING TO PAYMENT EVENTs
export const webhookController = asyncErrorHandler(async (req, res, next) => {
  console.log("Listening Webhook");

  // Checking if the request is from stripe
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.ENDPOINT_SECRET
    );
  } catch (error) {
    console.log(error);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  const data = event.data.object;
  const eventType = event.type;

  console.log("Event:", event.type);

  // Listening to event
  if (eventType === "checkout.session.completed") {
    console.log("Payment Success");
  }

  res.send(200);
});
