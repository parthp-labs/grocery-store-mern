import React, { useState } from "react";
import { useEffect } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import Breadcrumb from "../components/Breadcrumb";
import Loader from "../components/Loader";
import OrderDetailsSection from "../components/OrderDetailsSection";

import { useGetOrderQuery } from "../redux/api/ordersApi";

function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState({});
  const navigate = useNavigate();

  const orderId = searchParams.get("orderId");

  const { data, isLoading } = useGetOrderQuery(orderId);

  useEffect(() => {
    if (data) {
      // Redirecting user if the order status is not success
      if (data.order.status !== "processing") {
        navigate("/");
      }
      setOrderDetails(data.order);
    }
  }, [data]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Breadcrumb
            destination="Order Placed"
            parentDestination="Checkout"
            parentDestinationLink="/checkout"
          />

          <div className="container order__details__container">
            <h4 className="order__placed__response success__msg">
              Your order has been successfully placed.
            </h4>
            <OrderDetailsSection orderDetails={orderDetails} />
          </div>
        </>
      )}
    </>
  );
}

export default OrderSuccess;
