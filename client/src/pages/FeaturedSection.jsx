import React, { useEffect, useState } from "react";

import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { Link } from "react-router-dom";

function FeaturedSection({ sectionName = "", items = [] }) {
  return (
    <>
      <div className="latest-product__text">
        <h4>{sectionName}</h4>
        <OwlCarousel
          className="latest-product__slider"
          margin={0}
          items={1}
          autoplay
          loop
          nav={true}
          smartSpeed={1200}
        >
          <div
            key={Math.random() * 1000}
            className="latest-prdouct__slider__item item"
          >
            {items?.slice(0, 3).map((i) => (
              <Link
                key={Math.random() * 1000}
                to={`/shop/${i._id}`}
                className="latest-product__item"
              >
                <div className="latest-product__item__pic">
                  <img src={i.images[0]} alt="" />
                </div>
                <div className="latest-product__item__text">
                  <h6>{i.name}</h6>
                  {i.discount != 0 && (
                    <span className="featuredProduct__originalPrice">
                      Rs.{i.originalPrice}
                    </span>
                  )}
                  <span>Rs.{i.discountedPrice}</span>
                </div>
              </Link>
            ))}
          </div>
          <div
            key={Math.random() * 1000}
            className="latest-prdouct__slider__item item"
          >
            {items?.slice(3, 6).map((i) => (
              <Link
                key={Math.random() * 1000}
                to={`/shop/${i._id}`}
                className="latest-product__item"
              >
                <div className="latest-product__item__pic">
                  <img src={i.images[0]} alt="" />
                </div>
                <div className="latest-product__item__text">
                  <h6>{i.name}</h6>
                  {i.discount != 0 && (
                    <span className="featuredProduct__originalPrice">
                      Rs.{i.originalPrice}
                    </span>
                  )}
                  <span>Rs.{i.discountedPrice}</span>
                </div>
              </Link>
            ))}
          </div>
        </OwlCarousel>
      </div>
    </>
  );
}

export default FeaturedSection;
