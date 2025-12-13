import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faFileInvoice } from "@fortawesome/free-solid-svg-icons";

import useRequestHandler from "../hooks/useRequestHandler";

import OrderItem from "./OrderItem";
import CustomModal from "./CustomModal";
import Loader from "./Loader";

import {
  useCancelOrderMutation,
  useLazyDownloadOrderInvoiceQuery,
} from "../redux/api/ordersApi";
import { toast } from "react-toastify";

function OrderDetailsSection({
  orderDetails = {},
  orderDetailsLoading,
  showCancelOrder = true,
}) {
  const navigate = useNavigate();

  const [cancelOrder] = useCancelOrderMutation();
  const [
    downloadInvoice,
    {
      isLoading: downloadInvoiceLoading,
      isError: downloadInvoiceError,
      error,
      data,
    },
  ] = useLazyDownloadOrderInvoiceQuery();

  const { triggerMutationFunc: cancelOrderHandler } = useRequestHandler({
    mutationFunc: () => cancelOrder(orderDetails._id),
    showToastOnError: true,
    showToastOnSuccess: true,
    onSuccess: () => {
      closeCancelOrderModal();
      navigate("/account/orders");
    },
  });

  const {
    modal: CancelOrderModal,
    isOpen,
    openModal: openCancelOrderModal,
    closeModal: closeCancelOrderModal,
  } = CustomModal({
    title: "Are you sure that you want to cancel this order ?",
    description:
      "Once cancel, the order needs to be replaced after processing to the payment page",
    cancelButtonText: "No, I Don't Want To Cancel",
    actionButtons: (
      <>
        <button
          className="custom-modal__btn custom-modal__okBtn"
          onClick={cancelOrderHandler}
        >
          Yes, Cancel Order
        </button>
      </>
    ),
  });

  // For downloading order invoice
  const downloadInvoiceHandler = async (orderId) => {
    const { blob, filename } = await downloadInvoice({
      orderId: orderId,
    }).unwrap();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;

    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  useEffect(() => {
    if (downloadInvoiceError) toast.error(error?.data.message || "");
  }, [downloadInvoiceError]);

  return (
    <>
      <Loader
        isLoading={downloadInvoiceLoading || orderDetailsLoading}
        darkBg={false}
      />
      <div className="order__details__header">Order {orderDetails._id}</div>
      <div className="row">
        <div className="col-lg-8 col-md-6">
          <div className="order__delivery__details">
            <h5>Delivery Details</h5>
            <div>
              <p>{orderDetails.deliveryAddress?.houseNumber}</p>
              <p>{orderDetails.deliveryAddress?.streetInfo}</p>
              <p>
                {orderDetails.deliveryAddress?.city},{" "}
                {orderDetails.deliveryAddress?.pinCode}
              </p>
              <p>{orderDetails.deliveryAddress?.state}</p>
            </div>
          </div>
          <div className="order__items__table">
            <table>
              <thead>
                <tr>
                  <th>Products</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.orderItems?.map((item) => (
                  <OrderItem
                    key={item._id}
                    itemId={item._id}
                    image={item.images[0]}
                    name={item.name}
                    price={item.discountedPrice}
                    quantity={item.quantity}
                    total={(
                      Number(item.quantity) * Number(item.discountedPrice)
                    ).toFixed(2)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="order__details">
            <div className="order__details__section order__details__ordered__at">
              Placed At
              <span>
                {new Date(orderDetails.orderedOn).toLocaleDateString()} <br />
                at {new Date(orderDetails.orderedOn).toLocaleTimeString()}
              </span>
            </div>
            <div className="order__details__section order__details__status">
              Status
              <span
                className={`order__details__status__${orderDetails.status}`}
              >
                {orderDetails.status}
              </span>
            </div>

            <div className="order__details__section order__details__delivered__at">
              Delivered At
              <span>
                {orderDetails.status === "delivered" ? (
                  <>
                    {new Date(orderDetails.deliveredOn).toLocaleDateString()}{" "}
                    <br />
                    at {new Date(orderDetails.deliveredOn).toLocaleTimeString()}
                  </>
                ) : (
                  <>-----</>
                )}
              </span>
            </div>

            <div className="order__details__section order__details__payment__mode">
              Payment <span>{orderDetails.payment?.paymentMode}</span>
            </div>

            <div className="order__details__section">
              Subtotal <span>Rs.{orderDetails.subTotal}</span>
            </div>

            <div className="order__details__section">
              Tax <span>Rs.{orderDetails.tax}</span>
            </div>

            <div className="order__details__section">
              Delivery Charges <span>Rs.{orderDetails.deliveryCharges}</span>
            </div>

            <div className="order__details__section">
              Total <span>Rs.{orderDetails.totalAmount}</span>
            </div>

            {showCancelOrder && (
              <button
                type="button"
                className="order__details__cancel__btn site-btn"
                onClick={openCancelOrderModal}
                disabled={
                  orderDetails.status === "delivered" ||
                  (orderDetails.status === "cancelled" && true)
                }
              >
                CANCEL ORDER{" "}
                <i>
                  <FontAwesomeIcon icon={faCancel} />
                </i>
              </button>
            )}
            <button
              type="button"
              className="order__details__download__btn site-btn"
              onClick={() => downloadInvoiceHandler(orderDetails._id)}
            >
              DOWNLOAD INVOICE{" "}
              <i>
                <FontAwesomeIcon icon={faFileInvoice} />
              </i>
            </button>
          </div>
        </div>
      </div>
      {CancelOrderModal}
    </>
  );
}

export default OrderDetailsSection;
