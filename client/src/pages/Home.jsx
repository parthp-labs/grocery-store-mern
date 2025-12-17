import React, { useState } from "react";

import { motion } from "framer-motion";

import BlogCard from "../components/BlogCard";
import FeatureCard from "../components/FeatureCard";
import FeaturedSection from "./FeaturedSection";
import {
  useGetDiscountedItemsQuery,
  useGetItemCategoriesQuery,
  useGetItemsQuery,
  useGetLatestItemsQuery,
  useGetRatedItemsQuery,
} from "../redux/api/itemsApi";
import { useGetAllBlogsQuery } from "../redux/api/blogsApi";

import heroBanner from "../assets/hero/banner.jpg";
import banner1 from "../assets/banner/banner-1.jpg";
import banner2 from "../assets/banner/banner-2.jpg";
import { Link } from "react-router-dom";

function Home({ loadWishlist = () => {}, wishlist = [] }) {
  const [selectedFilter, setSelectedFilter] = useState();
  const [activeFilter, setActiveFilter] = useState("");

  const { data: featuredItemsData } = useGetItemsQuery({
    limit: 9,
    category: selectedFilter,
  });
  const { data: latestItemsData } = useGetLatestItemsQuery({ limit: 9 });
  const { data: ratedItemsData } = useGetRatedItemsQuery({ limit: 9 });
  const { data: discountedItemsData } = useGetDiscountedItemsQuery({
    limit: 9,
  });
  const { data: blogsData } = useGetAllBlogsQuery({ limit: 3 });
  const { data: itemCategoriesData } = useGetItemCategoriesQuery();

  const changeFilter = (e) => {
    setSelectedFilter(e.target.getAttribute("data-filter"));
    setActiveFilter(e.target.getAttribute("data-filter"));
  };

  return (
    <>
      {/* <!-- Hero Section Begin --> */}
      <section className="hero">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div
                className="hero__item set-bg"
                style={{ backgroundImage: `url(${heroBanner})` }}
              >
                <div className="hero__text">
                  <span>FRUIT FRESH</span>
                  <h2>
                    Vegetable <br />
                    100% Organic
                  </h2>
                  <p>Free Pickup and Delivery Available</p>
                  <Link to="/shop" className="primary-btn">
                    SHOP NOW
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Hero Section End --> */}

      {/* <!-- Featured Section Begin --> */}
      <section className="featured spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <h2>Featured Product</h2>
              </div>
              <div className="featured__controls">
                <ul>
                  <li
                    className={activeFilter === "" ? "active" : ""}
                    data-filter=""
                    onClick={changeFilter}
                  >
                    All
                  </li>
                  {itemCategoriesData?.categories.map((category) => (
                    <li
                      key={Math.random() * 1000}
                      onClick={changeFilter}
                      data-filter={category}
                      className={activeFilter === category ? "active" : ""}
                    >
                      {category}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <motion.div className="row featured__filter" initial={false}>
            {featuredItemsData?.item.map((i) => (
              <FeatureCard
                itemId={i._id}
                key={i._id}
                image={i.images[0]}
                name={i.name}
                price={i.discountedPrice}
                discount={i.discount}
                category={i.category}
                wishlist={wishlist}
                loadWishlist={loadWishlist}
              />
            ))}
          </motion.div>
        </div>
      </section>
      {/* <!-- Featured Section End --> */}

      {/* <!-- Banner Begin --> */}
      <div className="banner">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-6">
              <div className="banner__pic">
                <img src={banner1} alt="" />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6">
              <div className="banner__pic">
                <img src={banner2} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Banner End --> */}

      {/* <!-- Latest Product Section Begin --> */}
      <section className="latest-product spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <FeaturedSection
                sectionName="Latest Items"
                items={latestItemsData?.item}
              />
            </div>
            <div className="col-lg-4 col-md-6">
              <FeaturedSection
                sectionName="Rated Items"
                items={ratedItemsData?.item}
              />
            </div>
            <div className="col-lg-4 col-md-6">
              <FeaturedSection
                sectionName="Discounted Items"
                items={discountedItemsData?.item}
              />
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Latest Product Section End --> */}

      {/* <!-- Blog Section Begin --> */}
      {/* <section className="from-blog spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title from-blog__title">
                <h2>From The Blog</h2>
              </div>
            </div>
          </div>

          <div className="row justify-content-between">
            {blogsData?.blog.map((i) => (
              <div key={i._id} className="col-lg-4 col-md-4 col-sm-6">
                <BlogCard
                  title={i.title}
                  description={i.description}
                  image={i.image}
                  postedOn={i.createdOn}
                  commentsCount={i.comments.length}
                />
              </div>
            ))}
          </div>
        </div>
      </section> */}
      {/* <!-- Blog Section End --> */}
    </>
  );
}

export default Home;
