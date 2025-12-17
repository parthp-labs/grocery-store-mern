import React, { useEffect, useState } from "react";

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
import { useDispatch, useSelector } from "react-redux";

function ItemCard({
  item,
  itemId,
  image,
  name,
  price,
  discount,
  getUser,
  wishlist = [],
  loadWishlist,
}) {
  const [inWishlist, setInWishlist] = useState(false);

  const [addToCart, { isLoading, isError, error }] = useAddToCartMutation();

  const { triggerMutationFunc: addToCartHandler } = useRequestHandler({
    mutationFunc: () => addToCart({ itemId: itemId, quantity: 1 }),
    showToastOnError: true,
    showToastOnSuccess: true,
    onSuccess: getUser,
  });

  const wishlistHandler = () => {
    if (inWishlist) {
      try {
        const wishlist = JSON.parse(localStorage.getItem("wishlist"));

        wishlist.splice(wishlist.indexOf(itemId), 1);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        loadWishlist();
        toast.success("Item removed from wishlist");
        setInWishlist(false);
      } catch (error) {
        toast.error("Unable to remove from wishlist");
      }
    } else {
      let newWishlist = wishlist.map((i) => i._id);
      newWishlist.push(itemId);
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
      loadWishlist();
      toast.success("Item added to wishlist");
      setInWishlist(true);
    }
  };

  useEffect(() => {
    if (isError) {
      console.log(error);
      toast.error(error.data.message);
    }
  }, []);

  useEffect(() => {
    for (let item of wishlist) {
      if (item._id == itemId) {
        setInWishlist(true);
        break;
      }
    }
  }, [wishlist]);

  return (
    <div className="product__item">
      {discount != 0 && <span className="item__discount">-{discount}%</span>}
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
          <li
            onClick={wishlistHandler}
            style={
              inWishlist
                ? {
                    background: "#7fad39",
                    color: "white",
                  }
                : {}
            }
          >
            <i>
              <FontAwesomeIcon icon={faHeart} />
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
