import React, { useEffect, useState } from "react";

import { useSearchParams } from "react-router-dom";

import OrderDetailsSection from "../../components/OrderDetailsSection";
import { useLazyGetOrderQuery } from "../../redux/api/ordersApi";
import useRequestHandler from "../../hooks/useRequestHandler";
import { toast } from "react-toastify";

function ViewOrder() {
  const [searchParams, setSearchParams] = useSearchParams();
  const orderId = searchParams.get("id");

  const [orderDetails, setOrderDetails] = useState();
  const [
    getOrder,
    {
      data,
      isFetching: orderDetailsLoading,
      isError: orderDetailsError,
      error,
    },
  ] = useLazyGetOrderQuery();
  const { triggerQueryFunc: getOrderHandler } = useRequestHandler({
    queryFunc: () => getOrder(orderId),
    showToastOnError: true,
  });

  useEffect(() => {
    if (data && !orderDetailsLoading) {
      setOrderDetails(data.order);
    }
  }, [data, orderDetailsLoading]);

  useEffect(() => {
    console.log(error);
    if (orderDetailsError && !orderDetailsLoading) {
      setOrderDetails();
      toast.error(error.data?.message || error.error);
    }
  }, [orderDetailsError]);

  useEffect(() => {
    if (orderId) {
      getOrderHandler();
    }
  }, []);

  return (
    <>
      <h3 className="admin__dashboard__container__header">View Order</h3>

      <div className="form__field view__orders__search">
        <label>Order Id</label>
        <input
          placeholder="Enter order id to get details"
          value={orderId}
          onChange={(e) => setSearchParams({ id: e.target.value })}
        />
        <button onClick={getOrderHandler}>Search</button>
      </div>

      {orderDetails && (
        <OrderDetailsSection
          orderDetails={orderDetails}
          showCancelOrder={false}
          orderDetailsLoading={orderDetailsLoading}
        />
      )}
    </>
  );
}

export default ViewOrder;
