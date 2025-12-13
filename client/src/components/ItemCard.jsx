import React, { useEffect } from "react";

import productImage from "../assets/product/product-2.jpg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faRetweet,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import {
  useAddToCartMutation,
  useLazyGetUserQuery,
} from "../redux/api/userApi";
import { toast } from "react-toastify";
import useRequestHandler from "../hooks/useRequestHandler";
import { userExists } from "../redux/reducers/userReducer";
import { Link } from "react-router-dom";

function ItemCard({ itemId, image, name, price, getUser }) {
  const [addToCart, { isLoading, isError, error }] = useAddToCartMutation();

  const { triggerMutationFunc: addToCartHandler } = useRequestHandler({
    mutationFunc: () => addToCart({ itemId: itemId, quantity: 1 }),
    showToastOnError: true,
    showToastOnSuccess: true,
    onSuccess: getUser,
  });

  useEffect(() => {
    if (isError) {
      console.log(error);
      toast.error(error.data.message);
    }
  }, []);

  return (
    <div className="product__item">
      <div
        className="product__item__pic set-bg"
        style={{ backgroundImage: `url(${image})` }}
      >
        <ul className="product__item__pic__hover">
          <li
            onClick={() => {
              addToCartHandler();
            }}
          >
            <i>
              <FontAwesomeIcon icon={faShoppingCart} />
            </i>
          </li>
        </ul>
      </div>
      <div className="product__item__text">
        <h6>
          <Link to={`/shop/${itemId}`}>{name}</Link>
        </h6>
        <h5>Rs. {price}</h5>
      </div>
    </div>
  );
}

export default ItemCard;
