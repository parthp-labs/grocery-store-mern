import React from "react";

function OrderItem({ image, name, price, quantity, total }) {
  return (
    <>
      <tr>
        <td className="order__item">
          <img src={image} alt="" />
          <h5>{name}</h5>
        </td>
        <td className="order__item__price">Rs.{price}</td>
        <td className="order__item__quantity">{quantity}</td>
        <td className="order__item__total">Rs. {total}</td>
      </tr>
    </>
  );
}

export default OrderItem;
