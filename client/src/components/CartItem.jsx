import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

function CartItem({
  itemId,
  image,
  name,
  price,
  quantity,
  removeFromCartHandler,
  addToCartHandler,
}) {
  return (
    <>
      <tr>
        <td className="shoping__cart__item">
          <img src={image} alt="" />
          <h5>{name}</h5>
        </td>
        <td className="shoping__cart__price">Rs.{price}</td>
        <td className="shoping__cart__quantity">
          <div className="quantity">
            <div className="pro-qty">
              <i
                onClick={() => {
                  removeFromCartHandler({
                    itemId: itemId,
                    quantity: 1,
                  });
                }}
              >
                <FontAwesomeIcon icon={faMinus} />
              </i>
              <input
                type="text"
                value={quantity}
                onChange={() => {}}
                disabled
              />
              <i
                onClick={() => {
                  addToCartHandler({
                    itemId: itemId,
                    quantity: 1,
                  });
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
              </i>
            </div>
          </div>
        </td>
        <td className="shoping__cart__total">
          Rs. {(Number(price) * Number(quantity)).toFixed(2)}
        </td>
        <td className="shoping__cart__item__close">
          <span
            onClick={() => {
              removeFromCartHandler({
                itemId: itemId,
                quantity: quantity,
              });
            }}
          >
            <FontAwesomeIcon icon={faClose} />
          </span>
        </td>
      </tr>
    </>
  );
}

export default CartItem;
