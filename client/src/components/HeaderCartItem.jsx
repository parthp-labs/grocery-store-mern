import React from "react";

import itemImage from "../assets/product/product-1.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

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
