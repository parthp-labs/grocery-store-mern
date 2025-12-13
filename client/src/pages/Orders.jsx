import React, { useEffect, useRef, useState } from "react";

import ReactSelect from "react-select";
import { toast } from "react-toastify";

import Breadcrumb from "../components/Breadcrumb";
import OrderTableItem from "../components/OrderTableItem";
import TableLoader from "../components/TableLoader";

import { useGetUserOrdersQuery } from "../redux/api/ordersApi";

const statusOptions = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "processing",
    label: "Processing",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
  {
    value: "delivered",
    label: "Delivered",
  },
];

function Orders() {
  const [orderId, setOrderId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [userOrders, setUserOrders] = useState([]);

  const {
    data,
    isFetching: isLoading,
    isError,
    error,
  } = useGetUserOrdersQuery({
    orderId,
    fromDate,
    toDate,
    minAmount,
    maxAmount,
    status: selectedStatus,
  });

  // For resetting all the applied filters
  const resetFilters = () => {
    setMaxAmount("");
    setMinAmount("");
    setSelectedStatus("all");
    setFromDate("");
    setToDate("");
    setOrderId("");
  };

  useEffect(() => {
    if (data) {
      setUserOrders(data.order);
    }
  }, [data, isError]);

  useEffect(() => {
    if (isError) {
      if (error.code != 404) {
        toast.error(error.data.message);
        setUserOrders([]);
      }
    }
  }, [error, isLoading]);

  return (
    <>
      <Breadcrumb destination={"My Orders"} parentDestination="Account" />

      <section className="orders spad">
        <div className="container-lg">
          <div className="orders__filter row">
            <div className="col-12">
              <button className="site-btn mb-4" onClick={resetFilters}>
                Reset Filters
              </button>
            </div>
            <div className="filter__input col-md-4 col-6">
              <label>Order Id</label>
              <input
                placeholder="Enter order id"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>

            <div className="filter__input col-md-4 col-6">
              <label>From </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="filter__input col-md-4 col-6">
              <label>To </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div className="filter__input col-md-4 col-6">
              <label>Min Amount</label>
              <input
                type="number"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
              />
            </div>
            <div className="filter__input col-md-4 col-6">
              <label>Max Amount </label>
              <input
                type="number"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
              />
            </div>
            <div className="filter__input col-md-4 col-6">
              <label>Status</label>
              <ReactSelect
                options={statusOptions}
                isSearchable={false}
                isClearable={false}
                tabSelectsValue={selectedStatus}
                onChange={(e) => setSelectedStatus(e.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="orders__table">
                <h5 className="table__results__count">
                  {userOrders.length} results found
                </h5>
                <table>
                  <thead>
                    <tr>
                      <th className="orders__order__id__header">Id</th>
                      <th className="orders__order__items__header">
                        Total Items
                      </th>
                      <th>Sub Total</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                      <th className="orders__order__actions__header"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td>
                          <TableLoader />
                        </td>
                      </tr>
                    ) : (
                      userOrders.map((order) => (
                        <OrderTableItem
                          key={order._id}
                          orderId={order._id}
                          totalItems={order.orderItems.length}
                          subTotal={order.subTotal}
                          total={order.totalAmount}
                          status={order.status}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Orders;
