import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import Breadcrumb from "../components/Breadcrumb";
import CartItem from "../components/CartItem";

import useRequestHandler from "../hooks/useRequestHandler";
import {
  useRemoveFromCartMutation,
  useAddToCartMutation,
} from "../redux/api/userApi";
import { updateCart } from "../redux/reducers/userReducer.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartFlatbed,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

function Cart() {
  const userState = useSelector((state) => state.userReducer);
  const navigate = useNavigate();

  const [removeFromCart] = useRemoveFromCartMutation();
  const [addToCart] = useAddToCartMutation();
  const { triggerMutationFunc: removeFromCartHandler } = useRequestHandler({
    mutationFunc: ({ itemId, quantity }) =>
      removeFromCart({ itemId, quantity }),
    showToastOnError: true,
    showToastOnSuccess: true,
    reducerFunc: updateCart,
  });
  const { triggerMutationFunc: addToCartHandler } = useRequestHandler({
    mutationFunc: ({ itemId, quantity }) => addToCart({ itemId, quantity }),
    showToastOnError: true,
    showToastOnSuccess: true,
    reducerFunc: updateCart,
  });

  return (
    <>
      <Breadcrumb destination={"Shopping Cart"} />
      {/* <!-- Shopping Cart Section Begin --> */}
      <section className="shoping-cart spad">
        <div className="container-lg">
          <div className="row">
            <div className="col-lg-12 col-sm-12">
              <div className="shoping__cart__table">
                <table>
                  <thead>
                    <tr>
                      <th className="shoping__product">Products</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {userState.user?.cart.items.length === 0 && (
                      <tr>
                        <td colSpan={4}>
                          <i className="cart__empty">
                            <FontAwesomeIcon icon={faShoppingCart} />
                            <h3>Your cart is empty</h3>
                          </i>
                        </td>
                      </tr>
                    )}
                    {userState.user?.cart.items.map((item) => (
                      <CartItem
                        key={item.item._id}
                        itemId={item.item._id}
                        image={item.item.images[0]}
                        name={item.item.name}
                        quantity={item.quantity}
                        price={item.item.discountedPrice}
                        addToCartHandler={addToCartHandler}
                        removeFromCartHandler={removeFromCartHandler}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="shoping__cart__btns">
                <Link to="/shop" className="primary-btn">
                  CONTINUE SHOPPING
                </Link>
              </div>
            </div>
            {/* <div className="col-lg-6">
              <div className="shoping__continue">
                <div className="shoping__discount">
                  <h5>Discount Codes</h5>
                  <form action="#">
                    <input type="text" placeholder="Enter your coupon code" />
                    <button type="submit" className="site-btn">
                      APPLY COUPON
                    </button>
                  </form>
                </div>
              </div>
            </div> */}
            <div className="col-lg-12">
              <div className="shoping__checkout">
                <h5>Cart Total</h5>
                <ul>
                  <li>
                    Subtotal <span>Rs.{userState.user?.cart.cartTotal}</span>
                  </li>
                  <li>
                    Total <span>Rs. {userState.user?.cart.cartTotal}</span>
                  </li>
                </ul>
                <button
                  onClick={() =>
                    userState.user?.cart.items.length === 0
                      ? toast.error(
                          "Your cart is empty. Please first add items to go for checkout"
                        )
                      : navigate("/checkout")
                  }
                  className="primary-btn"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Shopping Cart Section End --> */}
    </>
  );
}

export default Cart;
