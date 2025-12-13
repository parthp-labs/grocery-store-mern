import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ReactSelect from "react-select";

import {
  useLazyGetOrderQuery,
  useProcessOrderMutation,
} from "../../redux/api/ordersApi";
import useRequestHandler from "../../hooks/useRequestHandler";

const availableStatus = ["processing", "delivered", "cancelled", "pending"];

function ProcessOrder() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orderId, setOrderId] = useState();
  const [statusOptions, setStatusOptions] = useState([]);
  const [orderStatus, setOrderStatus] = useState();
  const [newOrderStatus, setNewOrderStatus] = useState();

  const [getOrder, { data, isLoading, isError }] = useLazyGetOrderQuery();
  const { triggerQueryFunc: getOrderHandler } = useRequestHandler({
    queryFunc: (orderId) => getOrder(orderId),
    showToastOnError: true,
    onSuccess: (res) => setOrderStatus(res.order.status),
    onError: () => setOrderStatus(),
  });

  const [processOrder] = useProcessOrderMutation();
  const { triggerMutationFunc: processOrderHandler } = useRequestHandler({
    mutationFunc: () =>
      processOrder({ orderId: orderId, status: newOrderStatus.toLowerCase() }),
    showToastOnError: true,
    showToastOnSuccess: true,
    onSuccess: () => getOrderHandler(searchParams.get("id")),
  });

  useEffect(() => {
    if (searchParams.get("id")) {
      setOrderId(searchParams.get("id"));
      getOrderHandler(searchParams.get("id"));
    }
  }, []);

  useEffect(() => {
    setSearchParams({ id: orderId });
  }, [orderId]);

  useEffect(() => {
    if (orderStatus) {
      const temp = [];
      availableStatus.forEach((status) => {
        if (status !== orderStatus) {
          temp.push({
            label: status.replace(status[0], status[0].toUpperCase()),
            value: status,
          });
        }
      });

      setStatusOptions(temp);
    }
  }, [orderStatus]);

  return (
    <>
      <h3 className="admin__dashboard__container__header">Process Order</h3>

      <div className="process__order__container">
        <div className="form__field process__orders__search">
          <label>Order Id</label>
          <input
            placeholder="Enter order id to get details"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
          <button onClick={() => getOrderHandler(orderId)}>Search</button>
        </div>

        {orderStatus && (
          <>
            <h4>
              Current Order Status:{" "}
              <span className={orderStatus}>{orderStatus}</span>
            </h4>
            <div className="form__field process__orders__search">
              <label>New Order Status</label>
              <ReactSelect
                options={statusOptions}
                isSearchable={false}
                placeholder="Select status"
                onChange={(e) => setNewOrderStatus(e.value)}
              />
              <button onClick={processOrderHandler}>Process Order</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default ProcessOrder;
