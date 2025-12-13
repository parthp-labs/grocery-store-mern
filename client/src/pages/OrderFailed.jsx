import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetOrderQuery } from "../redux/api/ordersApi";
import Loader from "../components/Loader";
import Breadcrumb from "../components/Breadcrumb";
import OrderDetailsSection from "../components/OrderDetailsSection";

function OrderFailed() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { data, isLoading } = useGetOrderQuery(orderId);
  const [orderDetails, setOrderDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      // Redirecting user if the order status is not failed
      if (data.order.status !== "cancelled") {
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
            destination="Order Failed"
            parentDestination="Checkout"
            parentDestinationLink="/checkout"
          />

          <div className="container order__details__container">
            <h4 className="order__placed__response fail__msg">
              Your order was failed to be placed due to some problem.
            </h4>
            <OrderDetailsSection orderDetails={orderDetails} />
          </div>
        </>
      )}
    </>
  );
}

export default OrderFailed;
