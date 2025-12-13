import React from "react";

import itemImage from "../assets/product/product-1.jpg";

function HeaderCartItem({ image, name, price, quantity }) {
  return (
    <div>
      <img src={image} />
      <div>
        <p>{name}</p>
        <span>
          {quantity} for Rs.{price}
        </span>
      </div>
    </div>
  );
}

export default HeaderCartItem;
