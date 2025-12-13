import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";

import Breadcrumb from "../components/Breadcrumb";
import OrderDetailsSection from "../components/OrderDetailsSection";
import ContainerLoader from "../components/ContainerLoader";

import { useGetOrderQuery } from "../redux/api/ordersApi";

function ViewOrder() {
  const params = useParams();
  const orderId = params.orderId;
  const navigate = useNavigate();

  const { data, isFetching, isError, error } = useGetOrderQuery(orderId);

  useEffect(() => {
    if (error) {
      console.log(error);
      toast.error(error.data?.message);
      navigate("/account/orders");
    }
  }, [data, isError]);

  return (
    <>
      <Breadcrumb
        destination={`Order ${orderId}`}
        parentDestination="Orders"
        parentDestinationLink="/account/orders"
      />

      <ContainerLoader isLoading={isFetching} />
      <div className="container view__order__container">
        <OrderDetailsSection orderDetails={data?.order} />
      </div>
    </>
  );
}

export default ViewOrder;
