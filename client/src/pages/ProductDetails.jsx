import React, { useEffect, useState } from "react";

import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faStarHalf,
  faHeartCirclePlus as faHeart,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faPinterest,
} from "@fortawesome/free-brands-svg-icons";
import ProductCard from "../components/ItemCard";
import ReviewCard from "../components/ReviewCard";

import $, { data } from "jquery";
import Breadcrumb from "../components/Breadcrumb";
import { useParams } from "react-router-dom";
import { useGetItemByIdQuery } from "../redux/api/itemsApi";

import Loader from "../components/Loader";
import { useDispatch } from "react-redux";
import useRequestHandler from "../hooks/useRequestHandler";
import {
  useAddToCartMutation,
  useLazyGetUserQuery,
} from "../redux/api/userApi";
import { userExists } from "../redux/reducers/userReducer";

function ProductDetails() {
  const params = useParams();
  const [itemDetails, setItemDetails] = useState({});
  const [quantity, setQuantity] = useState(1);

  const { data: itemDataRes, isLoading } = useGetItemByIdQuery(params.itemId);
  const [addToCart] = useAddToCartMutation();
  const [getUser] = useLazyGetUserQuery();

  const { triggerQueryFunc: getUserHandler } = useRequestHandler({
    queryFunc: getUser,
    reducerFunc: (data) => userExists(data.user),
  });
  const { triggerMutationFunc: addToCartHandler } = useRequestHandler({
    mutationFunc: () =>
      addToCart({ itemId: itemDetails._id, quantity: quantity }),
    onSuccess: () => getUserHandler(),
    showToastOnError: true,
    showToastOnSuccess: true,
  });

  useEffect(() => {
    if (itemDataRes) {
      setItemDetails(itemDataRes.item);
    } else {
      setItemDetails({});
    }
  }, [itemDataRes]);

  useEffect(() => {
    $(".product__details__pic__slider img").on("click", function () {
      var imgurl = $(this).data("imgbigurl");
      var bigImg = $(".product__details__pic__item--large").attr("src");
      if (imgurl != bigImg) {
        $(".product__details__pic__item--large").attr({
          src: imgurl,
        });
      }
    });
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Breadcrumb
            parentDestination={"Shop"}
            parentDestinationLink={"/shop"}
            destination={itemDetails.name}
          />

          {/* <!-- Product Details Section Begin --> */}
          <section className="product-details spad">
            <div className="container">
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="product__details__pic">
                    <div className="product__details__pic__item">
                      <img
                        className="product__details__pic__item--large"
                        src={itemDataRes?.item.images[0]}
                        alt=""
                      />
                    </div>
                    <OwlCarousel
                      className="product__details__pic__slider"
                      smartSpeed={1200}
                      items={4}
                      margin={20}
                      dots={true}
                      autoplay
                      loop
                    >
                      {itemDataRes?.item.images.map((img) => (
                        <img
                          key={Math.random() * 1000}
                          data-imgbigurl={img}
                          src={img}
                          alt=""
                        />
                      ))}
                    </OwlCarousel>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="product__details__text">
                    <h3>{itemDetails.name}</h3>
                    <div className="product__details__rating">
                      <i>
                        <FontAwesomeIcon icon={faStar} />
                      </i>
                      <i>
                        <FontAwesomeIcon icon={faStar} />
                      </i>
                      <i>
                        <FontAwesomeIcon icon={faStar} />
                      </i>
                      <i>
                        <FontAwesomeIcon icon={faStar} />
                      </i>
                      <i>
                        <FontAwesomeIcon icon={faStarHalf} />
                      </i>

                      <span>(18 reviews)</span>
                    </div>
                    <div className="product__details__price">
                      <div className="product__details__discounted__price">
                        Rs.{itemDetails.discountedPrice}
                      </div>
                      {itemDetails.discount > 0 && (
                        <div className="product__details__original__price">
                          Rs.{itemDetails.originalPrice}
                        </div>
                      )}
                    </div>
                    <p>{itemDetails.description}</p>
                    <div className="product__details__quantity">
                      <div className="quantity">
                        <div className="pro-qty">
                          <button
                            className="dec qtybtn"
                            onClick={() => setQuantity(quantity - 1)}
                          >
                            -
                          </button>
                          <input
                            type="text"
                            value={quantity}
                            onChange={(event) =>
                              setQuantity(event.target.value)
                            }
                          />
                          <button
                            className="inc qtybtn"
                            onClick={() => setQuantity(quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <button className="primary-btn" onClick={addToCartHandler}>
                      ADD TO CART
                    </button>
                    <a href="#" className="heart-icon">
                      <span className="icon_heart_alt">
                        <FontAwesomeIcon icon={faHeart} />
                      </span>
                    </a>
                    <ul>
                      <li>
                        <b>Availability</b>{" "}
                        <span
                          className={
                            "availability__text " +
                            (itemDetails.stock > 0 ? "instock" : "outofstock")
                          }
                        >
                          {itemDetails.stock > 0 ? "In Stock" : "Out Of Stock"}
                        </span>
                      </li>
                      <li>
                        <b>Shipping</b> <span>01 day shipping.</span>
                      </li>
                      <li>
                        <b>Weight</b> <span>{itemDetails.weight} kg</span>
                      </li>
                      <li>
                        <b>Share on</b>
                        <div className="share">
                          <a href="#">
                            <i>
                              <FontAwesomeIcon icon={faFacebook} />
                            </i>
                          </a>
                          <a href="#">
                            <i>
                              <FontAwesomeIcon icon={faTwitter} />
                            </i>
                          </a>
                          <a href="#">
                            <i>
                              <FontAwesomeIcon icon={faInstagram} />
                            </i>
                          </a>
                          <a href="#">
                            <i>
                              <FontAwesomeIcon icon={faPinterest} />
                            </i>
                          </a>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="product__details__tab">
                    <ul className="nav nav-tabs" role="tablist">
                      <li className="nav-item">
                        <a
                          className="nav-link active"
                          data-toggle="tab"
                          href="#tabs-1"
                          role="tab"
                          aria-selected="true"
                        >
                          Description
                        </a>
                      </li>

                      <li className="nav-item">
                        <a
                          className="nav-link"
                          data-toggle="tab"
                          href="#tabs-2"
                          role="tab"
                          aria-selected="false"
                        >
                          Reviews <span>(1)</span>
                        </a>
                      </li>
                    </ul>
                    <div className="tab-content">
                      <div
                        className="tab-pane active"
                        id="tabs-1"
                        role="tabpanel"
                      >
                        <div className="product__details__tab__desc">
                          <h6>Description</h6>
                          <p>{itemDetails?.description}</p>
                        </div>
                      </div>
                      <div className="tab-pane" id="tabs-2" role="tabpanel">
                        <div className="product__details__tab__desc">
                          <h6>Reviews</h6>
                          <OwlCarousel
                            items={3}
                            smartSpeed={1200}
                            responsive={{
                              320: {
                                items: 1,
                              },

                              480: {
                                items: 2,
                              },

                              768: {
                                items: 2,
                              },

                              992: {
                                items: 3,
                              },
                            }}
                            dots
                            autoplay
                            className="product__reviews__container"
                          >
                            <ReviewCard />
                            <ReviewCard />
                            <ReviewCard />
                            <ReviewCard />
                            <ReviewCard />
                          </OwlCarousel>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* <!-- Product Details Section End --> */}

          {/* <!-- Related Product Section Begin --> */}
          {/* <section className="related-product">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="section-title related__product__title">
                    <h2>Related Product</h2>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <ProductCard />
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <ProductCard />
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <ProductCard />
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <ProductCard />
                </div>
              </div>
            </div>
          </section> */}
          {/* <!-- Related Product Section End --> */}
        </>
      )}
    </>
  );
}

export default ProductDetails;
