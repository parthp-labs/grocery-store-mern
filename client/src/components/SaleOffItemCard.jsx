import {
  faHeart,
  faRetweet,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import {
  useAddToCartMutation,
  useLazyGetUserQuery,
} from "../redux/api/userApi";
import useRequestHandler from "../hooks/useRequestHandler";
import { userExists } from "../redux/reducers/userReducer";
import { Link } from "react-router-dom";

function SaleOffItemCard({
  itemId,
  image,
  name,
  discount,
  discountedPrice,
  originalPrice,
  category = [],
}) {
  const [getUser] = useLazyGetUserQuery();
  const [addToCart, { isLoading, isError, error }] = useAddToCartMutation();

  const { triggerQueryFunc: getUserFunc } = useRequestHandler({
    queryFunc: getUser,
    reducerFunc: (data) => userExists(data.user),
    showToastOnError: true,
    showToastOnSuccess: true,
  });
  const { triggerMutationFunc: addToCartHandler } = useRequestHandler({
    mutationFunc: () => addToCart({ itemId: itemId, quantity: 1 }),
    showToastOnError: true,
    showToastOnSuccess: true,
    onSuccess: () => getUser(),
  });
  return (
    <>
      <div className="product__discount__item">
        <div
          className="product__discount__item__pic set-bg"
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="product__discount__percent">-{discount}%</div>
          <ul className="product__item__pic__hover">
            <li>
              <i>
                <FontAwesomeIcon icon={faHeart} />
              </i>
            </li>
            <li>
              <i>
                <FontAwesomeIcon icon={faRetweet} />
              </i>
            </li>
            <li onClick={addToCartHandler}>
              <i>
                <FontAwesomeIcon icon={faShoppingCart} />
              </i>
            </li>
          </ul>
        </div>
        <div className="product__discount__item__text">
          <span>
            {category.map((i) => i.replace(i[0], i[0].toUpperCase()) + ", ")}
          </span>
          <h5>
            <Link to={`/shop/${itemId}`}>{name}</Link>
          </h5>
          <div className="product__item__price">
            ${discountedPrice}.00 <span>${originalPrice}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default SaleOffItemCard;
