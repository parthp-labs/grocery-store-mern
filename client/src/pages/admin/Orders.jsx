import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import OrdersTableComponent from "../../components/admin/OrdersTableComponent";
import ReactSelect from "react-select";
import { useGetAllOrdersQuery } from "../../redux/api/ordersApi";
import { useNavigate } from "react-router-dom";

function Orders() {
  const [orderId, setOrderId] = useState();
  const [userId, setUserId] = useState();
  const [status, setStatus] = useState();

  const navigate = useNavigate();

  const { data, isLoading } = useGetAllOrdersQuery({
    orderId,
    userId,
    status,
  });

  const handleResetFilter = () => {
    setOrderId();
    setUserId();
    setStatus("");
  };

  return (
    <>
      <button className="site-btn" onClick={handleResetFilter}>
        <i>
          <FontAwesomeIcon icon={faRefresh} />
        </i>
        Reset Filters
      </button>
      <div className="admin__orders__filter">
        <div className="filter__input">
          <label>Id</label>
          <input
            placeholder="Enter order id"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
        </div>
        <div className="filter__input">
          <label>Customer Id</label>
          <input
            placeholder="Enter customer id"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <div className="filter__input">
          <label>Status</label>
          <ReactSelect
            options={[
              {
                value: "",
                label: "All",
              },
              {
                value: "processing",
                label: "Processing",
              },
              {
                value: "delivered",
                label: "Delivered",
              },
              {
                value: "cancelled",
                label: "Cancelled",
              },
              {
                value: "pending",
                label: "Pending",
              },
            ]}
            placeholder="Select status"
            value={status}
            isSearchable={false}
            onChange={(e) => setStatus(e.value)}
          />
        </div>
        {/* <div className="filter__input range__input">
          <label>Min Price: Rs.{minPrice}</label>

          <MultiRangeSlider
            min={0}
            max={10000}
            step={5}
            minValue={minPrice}
            maxValue={maxPrice}
            onInput={(e) => priceRangeHandler(e)}
            style={{
              border: "none",
              boxShadow: "none",
              padding: "10px 2px",
              width: "100%",
            }}
            label={true}
            ruler={false}
            barLeftColor="#ebebeb"
            barRightColor="#ebebeb"
            barInnerColor="#dd2222"
            canMinMaxValueSame={true}
          />
          <div className="range__values">
            <label>Min Price: Rs.{maxPrice}</label>
          </div>
        </div>
        <div className="filter__input">
          <label>Category</label>
          <ReactSelect
            placeholder="Select category"
            options={categoryOptions}
            isSearchable={true}
          />
        </div> */}
      </div>
      <table className="admin__orders__table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Customer Id</th>
            <th>Total Items</th>
            <th>SubTotal</th>
            <th>Total</th>
            <th>Status</th>
            <th>Placed On</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? ""
            : data?.order.map((i) => (
                <OrdersTableComponent
                  key={i._id}
                  id={i._id}
                  customerId={i.user?._id}
                  totalItems={i.orderItems.length}
                  subTotal={i.subTotal}
                  total={i.totalAmount}
                  status={i.status}
                  placedOn={i.orderedOn}
                  viewOrderHandler={() =>
                    navigate(`/admin/orders/view?id=${i._id}`)
                  }
                  processOrderHandler={() =>
                    navigate(`/admin/orders/process?id=${i._id}`)
                  }
                />
              ))}
        </tbody>
      </table>
    </>
  );
}

export default Orders;
