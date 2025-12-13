import {
  faBars,
  faExpand,
  faShippingFast,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { formatDate } from "../utils/utilityFunctions";
import AdminActionMenu from "../ActionMenu";

function OrdersTableComponent({
  id,
  customerId,
  totalItems,
  subTotal,
  total,
  status,
  placedOn,
  viewOrderHandler,
  processOrderHandler,
}) {
  return (
    <>
      <tr>
        <td>{id}</td>
        <td>{customerId}</td>
        <td>{totalItems}</td>
        <td>Rs. {subTotal}</td>
        <td>Rs. {total}</td>
        <td className={"orders__order__status" + ` order__${status}`}>
          {status}
        </td>
        <td>{formatDate(placedOn)}</td>
        <td>
          <AdminActionMenu
            menuItems={[
              {
                label: "View Order",
                icon: faExpand,
                onClickHandler: viewOrderHandler,
              },
              {
                label: "Process Order",
                icon: faShippingFast,
                onClickHandler: processOrderHandler,
              },
            ]}
          />
        </td>
      </tr>
    </>
  );
}

export default OrdersTableComponent;
