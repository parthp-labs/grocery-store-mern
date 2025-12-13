import {
  faBars,
  faCancel,
  faExpand,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import ActionMenu from "./ActionMenu";

function OrderTableItem({ orderId, subTotal, total, totalItems, status }) {
  const navigate = useNavigate();
  return (
    <tr>
      <td className="orders__order__id">
        <h5>{orderId}</h5>
      </td>
      <td className="orders__order__items">{totalItems}</td>
      <td>Rs. {subTotal}</td>
      <td>Rs. {total}</td>
      <td className={`orders__order__status order__${status}`}>{status}</td>
      <td className="orders__order__actions">
        <ActionMenu
          menuItems={[
            {
              label: "View Order",
              icon: faExpand,
              onClickHandler: () => navigate(`/orders/${orderId}`),
            },
          ]}
        />
      </td>
    </tr>
  );
}

export default OrderTableItem;
