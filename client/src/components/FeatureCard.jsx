import React, { useEffect, useState } from "react";
import itemImage from "../assets/featured/feature-1.jpg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faShoppingCart,
  faRetweet,
} from "@fortawesome/free-solid-svg-icons";
import {
  useAddToCartMutation,
  useLazyGetUserQuery,
} from "../redux/api/userApi";
import { toast } from "react-toastify";
import useRequestHandler from "../hooks/useRequestHandler";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function FeatureCard({
  itemId,
  image,
  name,
  price,
  category = [],
  getUser,
  wishlist = [],
  loadWishlist = () => {},
}) {
  const [categories, setCategories] = useState("");
  const [inWishlist, setInWishlist] = useState(false);

  const [addToCart] = useAddToCartMutation();

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
        setInWishlist(false);
        toast.success("Item removed from wishlist");
      } catch (error) {
        toast.error("Unable to remove from wishlist");
      }
    } else {
      let newWishlist = wishlist.map((i) => i._id);
      newWishlist.push(itemId);
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
      loadWishlist();
      setInWishlist(true);
      toast.success("Item added to wishlist");
    }
  };

  useEffect(() => {
    category.forEach((cat) => {
      setCategories(categories + `${cat} `);
    });
  }, [category]);

  useEffect(() => {
    for (let item of wishlist) {
      if (item._id == itemId) {
        setInWishlist(true);
        break;
      }
    }
  }, [wishlist]);

  return (
    <motion.div
      animate={{ opacity: [0, 100] }}
      transition={{ duration: 0.8 }}
      exit={{ opacity: [100, 0] }}
      className={`col-lg-3 col-md-4 col-sm-6 mix ${categories}`}
    >
      <div className="product__item">
        <div
          className="product__item__pic set-bg"
          style={{ backgroundImage: `url(${image})` }}
        >
          <ul className="product__item__pic__hover">
            <li onClick={addToCartHandler}>
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
    </motion.div>
  );
}

export default FeatureCard;
