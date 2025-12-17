import React, { useEffect, useRef, useState } from "react";

import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import $ from "jquery";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faShoppingBag,
  faPhone,
  faBars,
  faUserCircle,
  faSignOut,
  faUserTie,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";

import logo from "../assets/logo.png";

import HeaderCartItem from "./HeaderCartItem";
import { useLogoutMutation } from "../redux/api/userApi";
import { userNotExists } from "../redux/reducers/userReducer";
import useRequestHandler from "../hooks/useRequestHandler";
import { useGetItemCategoriesQuery } from "../redux/api/itemsApi";
import { useAnimate, motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import WishlistItem from "./WishlistItem";

function Header({ wishlist = [], loadWishlist, getUser }) {
  const { user } = useSelector((state) => state.userReducer);
  const location = useLocation();
  const navigate = useNavigate();

  const [headerCartOpen, setHeaderCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  const headerCartBtnRef = useRef();
  const wishlistBtnRef = useRef();

  const hameBurgerMenuOverlayRef = useRef(null);
  const hameBurgerMenuWrapperRef = useRef(null);

  const [logout] = useLogoutMutation();
  const { triggerMutationFunc: triggerLogout } = useRequestHandler({
    mutationFunc: logout,
    reducerFunc: () => userNotExists(),
    showToastOnError: true,
    showToastOnSuccess: true,
    successRedirect: "/",
  });

  const { data } = useGetItemCategoriesQuery();

  // For Handling Search Enter in Header
  const headerSearchHandler = (e) => {
    e.preventDefault();

    const search = new FormData(e.target).get("search");
    navigate(`/shop?search=${search}`);
  };

  // For showing hamburger menu when menu button is clicked
  const showHamburgerMenu = () => {
    document.body.classList.add("over_hid");
    hameBurgerMenuOverlayRef.current.classList.add("active");
    hameBurgerMenuWrapperRef.current.classList.add(
      "show__humberger__menu__wrapper"
    );
  };

  // For closing hamburger menu when user clicks on overlay
  const closeHamburgerMenu = () => {
    document.body.classList.remove("over_hid");
    hameBurgerMenuOverlayRef.current.classList.remove("active");
    hameBurgerMenuWrapperRef.current.classList.remove(
      "show__humberger__menu__wrapper"
    );
  };

  // For closing header cart on click outside
  const closeCartHandler = (e) => {
    if (!headerCartBtnRef.current?.contains(e.target)) {
      setHeaderCartOpen(false);
    }
  };

  const closeWishlistHandler = (e) => {
    if (!wishlistBtnRef.current?.contains(e.target)) {
      setWishlistOpen(false);
    }
  };

  useEffect(() => {
    console.log(wishlist);
  }, [wishlist]);

  useEffect(() => {
    document.addEventListener("mouseover", closeCartHandler);
    document.addEventListener("mouseover", closeWishlistHandler);

    return () => {
      document.removeEventListener("mouseover", closeCartHandler);
      document.removeEventListener("mouseover", closeWishlistHandler);
    };
  }, []);

  return (
    <>
      {location.pathname !== "/register" && (
        <>
          <div
            className="humberger__menu__overlay"
            ref={hameBurgerMenuOverlayRef}
            onClick={closeHamburgerMenu}
          ></div>
          <div
            className="humberger__menu__wrapper"
            ref={hameBurgerMenuWrapperRef}
          >
            <div className="humberger__menu__logo">
              <Link to="/">
                <img src={logo} alt="" />
              </Link>
            </div>
            <div className="humberger__menu__cart">
              <ul>
                <li>
                  <Link to="/cart">
                    <i>
                      <FontAwesomeIcon icon={faShoppingBag} />{" "}
                    </i>
                    <span>{user?.cart.items.length || 0}</span>
                  </Link>
                </li>
                <li>
                  <Link>
                    <i>
                      <FontAwesomeIcon icon={faHeart} />{" "}
                    </i>
                    <span>{wishlist?.length || 0}</span>
                  </Link>
                </li>
              </ul>
              <div className="header__cart__price">
                Cart Total: <span>Rs.{user?.cart.cartTotal || 0}</span>
              </div>
            </div>
            <div className="humberger__menu__widget">
              <div className="header__top__right__auth">
                {user ? (
                  <>
                    <NavLink to="/account">
                      <FontAwesomeIcon icon={faUserCircle} /> Account
                    </NavLink>
                    {user.role === "admin" && (
                      <NavLink to="/admin/dashboard">
                        <FontAwesomeIcon icon={faUserTie} /> Dashboard
                      </NavLink>
                    )}
                  </>
                ) : (
                  <NavLink to="/register">
                    <i>
                      <FontAwesomeIcon icon={faUser} />
                    </i>
                    Login
                  </NavLink>
                )}
              </div>
            </div>
            <nav className="humberger__menu__nav mobile-menu">
              <ul>
                <li className="active">
                  <NavLink to="/">Home</NavLink>
                </li>
                <li>
                  <NavLink to="/shop">Shop</NavLink>
                </li>
                <li>
                  <NavLink to="/contact">Contact Us</NavLink>
                </li>
              </ul>
            </nav>
            {user && (
              <button className="site-btn" onClick={triggerLogout}>
                <i>
                  <FontAwesomeIcon icon={faSignOut} />
                </i>
                Logout
              </button>
            )}
            <div id="mobile-menu-wrap"></div>
          </div>

          <header className="header">
            <div className="header__top">
              <div className="container">
                <div className="header__top__right">
                  <div className="header__top__right__auth">
                    {user ? (
                      <div className="header__auth">
                        <NavLink to="/account">
                          <FontAwesomeIcon icon={faUserCircle} />
                          <span style={{ marginLeft: "5px" }}>
                            {user.firstName}
                          </span>
                        </NavLink>
                        {user.role === "admin" && (
                          <NavLink to="/admin/dashboard">
                            <FontAwesomeIcon icon={faUserTie} />
                          </NavLink>
                        )}

                        <button className="site-btn" onClick={triggerLogout}>
                          <i>
                            <FontAwesomeIcon icon={faSignOut} />
                          </i>
                          Logout
                        </button>
                      </div>
                    ) : (
                      <NavLink to="/register">
                        <i>
                          <FontAwesomeIcon icon={faUser} />
                        </i>
                        Login
                      </NavLink>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="row">
                <div className="col-lg-3">
                  <div className="header__logo">
                    <Link to="/">
                      <img src={logo} alt="" />
                    </Link>
                  </div>
                </div>
                <div className="col-lg-6">
                  <nav className="header__menu">
                    <ul>
                      <li className="active">
                        <NavLink to="/">Home</NavLink>
                      </li>
                      <li>
                        <NavLink to="/shop">Shop</NavLink>
                      </li>
                      {/* <li>
                        <NavLink to="/blogs">Blogs</NavLink>
                      </li> */}
                      <li>
                        <NavLink to="/contact">Contact Us</NavLink>
                      </li>
                    </ul>
                  </nav>
                </div>
                <div className="col-lg-3">
                  <div className="header__cart">
                    <ul>
                      {" "}
                      <li
                        onMouseOver={() => setWishlistOpen(true)}
                        ref={wishlistBtnRef}
                      >
                        <NavLink>
                          <i>
                            <FontAwesomeIcon icon={faHeart} />
                          </i>
                          <span>{wishlist?.length || 0}</span>
                        </NavLink>
                        <AnimatePresence>
                          {wishlistOpen && (
                            <motion.div
                              className="header__cartItems"
                              initial={{
                                display: "none",
                                height: 0,
                              }}
                              animate={{
                                display: "block",
                                height: "200px",
                              }}
                              exit={{ display: "none", height: 0 }}
                              transition={{ duration: 0.2, ease: "easeIn" }}
                            >
                              {wishlist?.map((item) => (
                                <WishlistItem
                                  getUser={getUser}
                                  key={item._id}
                                  id={item._id}
                                  image={item.images[0]}
                                  name={item.name}
                                  price={item.discountedPrice}
                                  quantity={item.quantity}
                                  loadWishlist={loadWishlist}
                                />
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </li>
                      <li
                        onMouseOver={() => {
                          setHeaderCartOpen(true);
                        }}
                        ref={headerCartBtnRef}
                      >
                        <NavLink to="/cart">
                          <i>
                            <FontAwesomeIcon icon={faShoppingBag} />
                          </i>
                          <span>{user?.cart.items.length || 0}</span>
                        </NavLink>

                        <AnimatePresence>
                          {headerCartOpen && (
                            <motion.div
                              className={
                                `header__cartItems ` +
                                (user?.cart.items.length == 0 &&
                                  "header__cartEmpty")
                              }
                              initial={{
                                display: "none",
                                height: 0,
                              }}
                              animate={{
                                display: "block",
                                height: "200px",
                              }}
                              exit={{ display: "none", height: 0 }}
                              transition={{ duration: 0.2, ease: "easeIn" }}
                            >
                              {user && user?.cart.items.length === 0 && (
                                <>
                                  <p>Your cart is empty</p>
                                  <Link to="/shop" className="site-btn">
                                    Start shopping
                                  </Link>
                                </>
                              )}
                              {!user && (
                                <>
                                  <Link to="/register" className="site-btn">
                                    Login To See Cart
                                  </Link>
                                </>
                              )}
                              {user?.cart.items.map((item) => (
                                <HeaderCartItem
                                  key={item.item._id}
                                  id={item.item._id}
                                  image={item.item.images[0]}
                                  name={item.item.name}
                                  price={item.item.discountedPrice}
                                  quantity={item.quantity}
                                />
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </li>
                    </ul>
                    <div className="header__cart__price">
                      Cart Total: <span>Rs.{user?.cart.cartTotal || 0}</span>
                    </div>
                    {!user && (
                      <Link to="/register">
                        <button className="site-btn header__cart__login">
                          <i>
                            <FontAwesomeIcon icon={faUser} />
                          </i>
                          Login
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              <div className="humberger__open" onClick={showHamburgerMenu}>
                <i>
                  <FontAwesomeIcon icon={faBars} />
                </i>
              </div>
            </div>
          </header>

          {/* <!-- Hero Section Begin --> */}
          {location.pathname !== "/admin/dashboard" && (
            <section className="hero hero-normal">
              <div className="container">
                <div className="row">
                  {/* <div className="col-lg-3">
                    <div className="hero__categories">
                      <div
                        className="hero__categories__all"
                        ref={heroCategoriesAllRef}
                      >
                        <i>
                          <FontAwesomeIcon icon={faBars} />
                        </i>
                        <span>All departments</span>
                        <i style={{ float: "right" }}>
                          <FontAwesomeIcon icon={faChevronDown} />
                        </i>
                      </div>
                      <ul>
                        {data?.categories.map((category) => (
                          <li key={Math.random() * 1000}>
                            <Link to={`/shop?category=${category}`}>
                              {category}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div> */}
                  <div className="col-lg-12">
                    <div className="hero__search">
                      <div className="hero__search__form">
                        <form onSubmit={headerSearchHandler}>
                          <input
                            type="text"
                            placeholder="What do yo u need?"
                            name="search"
                          />
                          <button type="submit" className="site-btn">
                            SEARCH
                          </button>
                        </form>
                      </div>
                      <div className="hero__search__phone">
                        <div className="hero__search__phone__icon">
                          <i>
                            <FontAwesomeIcon icon={faPhone} />
                          </i>
                        </div>
                        <div className="hero__search__phone__text">
                          <h5>+91 63********</h5>
                          <span>support 24/7 time</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
          {/* <!-- Hero Section End --> */}
        </>
      )}
    </>
  );
}

export default Header;
