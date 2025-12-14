import React, { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import $ from "jquery";
import ReactSelect from "react-select";
import MultiRangeSlider from "multi-range-slider-react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faFilter } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

import ItemCard from "../components/ItemCard";
import Breadcrumb from "../components/Breadcrumb";
import SaleOffItemCard from "../components/SaleOffItemCard";
import FeaturedSection from "./FeaturedSection";
import ContainerLoader from "../components/ContainerLoader";

import {
  useGetDiscountedItemsQuery,
  useGetItemCategoriesQuery,
  useGetItemsQuery,
  useGetLatestItemsQuery,
} from "../redux/api/itemsApi";
import { hideLoader, showLoader } from "../redux/reducers/loaderReducer";
import { useDispatch } from "react-redux";

const sortOptions = [
  {
    label: "Price Low To High",
    value: "price-low-to-high",
  },
  {
    label: "Price High To Low",
    value: "price-high-to-low",
  },
  {
    label: "Name Ascending",
    value: "name-asc",
  },
  {
    label: "Name Descending",
    value: "name-desc",
  },
];

// Department Item
function DepartmentItem({ onClickHandler, text, dataValue, isActive }) {
  return (
    <>
      <li
        data-value={dataValue}
        onClick={onClickHandler}
        className={isActive ? "active" : ""}
      >
        {text}
      </li>
    </>
  );
}

function Shop({ getUserFunc, wishlist = [], loadWishlist }) {
  const [maxPrice, setMaxPrice] = useState(10000);
  const [minPrice, setMinPrice] = useState(0);
  const [selectedSort, setSelectedSort] = useState("default");
  const [items, setItems] = useState([]);
  const [department, setDepartment] = useState("all");
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [discountedFeature, setDiscountedFeature] = useState();
  const [latestFeature, setLatestFeature] = useState();
  const [mobileFilterVisible, setMobileFilterVisible] = useState(false);

  const mobileFilterRef = useRef();
  const mobileFilterBtn = useRef();
  const dispatch = useDispatch();

  const { data: allItemsRes, isFetching: allItemsIsLoading } = useGetItemsQuery(
    {
      search,
      maxPrice,
      minPrice,
      category: department !== "all" ? department : "",
      discountedItems: discountedFeature,
      latestItems: latestFeature,
      limit: 18,
    }
  );
  const { data: discountedItemsRes } = useGetDiscountedItemsQuery({
    limit: 20,
  });
  const { data: latestItemsRes } = useGetLatestItemsQuery({ limit: 9 });
  const { data: itemCategoriesRes } = useGetItemCategoriesQuery();

  // For changing state when price range handler value is change
  const priceRangeHandler = (event) => {
    setMaxPrice(event.maxValue);
    setMinPrice(event.minValue);
  };

  // For sorting the results based on selected sort
  const sortHandler = (reqSort) => {
    setSelectedSort(reqSort);

    let sortedData = [...allItemsRes.item];

    switch (reqSort) {
      case "price-low-to-high":
        sortedData.sort(
          (a, b) => parseInt(a.discountedPrice) - parseInt(b.discountedPrice)
        );
        break;
      case "price-high-to-low":
        sortedData.sort(
          (a, b) => parseInt(b.discountedPrice) - parseInt(a.discountedPrice)
        );
        break;
      case "name-asc":
        sortedData.sort(function (a, b) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });

        break;
      case "name-desc":
        sortedData.sort(function (a, b) {
          if (a.name > b.name) {
            return -1;
          }
          if (a.name < b.name) {
            return 1;
          }
          return 0;
        });
        break;
      default:
        break;
    }

    setItems(sortedData);
  };

  // Resetting all filters and showing results with no filter
  const resetFilters = () => {
    setSearch("");
    setDepartment("all");
    setMaxPrice(10000);
    setMinPrice(0);
    setSearchParams({});

    $(".department__options li").each((index, elem) => {
      if (elem.getAttribute("data-value") === "all") {
        elem.classList.add("active");
      } else {
        elem.classList.remove("active");
      }
    });
  };

  // For selecting category of required items to filter it
  const departmentSelectHandler = (e) => {
    setDepartment(e.target.getAttribute("data-value"));
  };

  // For closing the filter sidebar when click outside
  const closeSidebarHandler = (e) => {
    if (
      !mobileFilterBtn.current.contains(e.target) &&
      !mobileFilterRef.current.contains(e.target)
    ) {
      setMobileFilterVisible(false);
    }
  };

  useEffect(() => {
    // Query search through url
    if (searchParams.get("category")) {
      setDepartment(searchParams.get("category"));
    }
    if (allItemsRes) {
      setItems(allItemsRes.item);
      sortHandler(selectedSort);
    }
  }, [allItemsRes, searchParams]);

  useEffect(() => {
    document.addEventListener("click", closeSidebarHandler);

    return () => {
      document.removeEventListener("click", closeSidebarHandler);
    };
  }, []);

  useEffect(() => {
    const itemName = searchParams.get("search");
    setSearch(itemName);
  }, [searchParams]);

  return (
    <>
      <Breadcrumb destination={"Shop"} />
      {/* <!-- Product Section Begin --> */}
      <section className="product spad">
        <div className="container">
          <div className="row">
            <motion.div
              className={`col-lg-3 col-md-5 shop__filter__sidebar ${
                mobileFilterVisible && "active"
              }`}
              ref={mobileFilterRef}
            >
              <div>
                <div className="sidebar__item">
                  <button className="site-btn" onClick={resetFilters}>
                    Reset Filters
                  </button>
                </div>
                <div className="sidebar__item">
                  <h4>Search By Name</h4>
                  <input
                    placeholder="Enter item name"
                    value={search || ""}
                    onChange={(e) => setSearch(e.target.value)}
                    className="sidebar__item__search"
                  />
                </div>
                <div className="sidebar__item">
                  <h4>Department</h4>
                  <ul className="department__options">
                    <DepartmentItem
                      dataValue="all"
                      text="All"
                      onClickHandler={departmentSelectHandler}
                      isActive={department === "all" ? true : false}
                    />
                    {[...(itemCategoriesRes?.categories || [])]
                      .sort()
                      .map((category) => (
                        <DepartmentItem
                          key={Math.random() * 1000}
                          dataValue={category}
                          text={category}
                          onClickHandler={departmentSelectHandler}
                          isActive={department === category ? true : false}
                        />
                      ))}
                  </ul>
                </div>
                <div className="sidebar__item">
                  <h4>Price</h4>
                  <div className="price-range-wrap">
                    <div className="price-range">
                      <MultiRangeSlider
                        min={0}
                        max={10000}
                        step={5}
                        minValue={minPrice}
                        maxValue={maxPrice}
                        onInput={(e) => priceRangeHandler(e)}
                        style={{
                          border: "none",
                          boxShadow: "none",
                          padding: "10px 2px",
                        }}
                        label={false}
                        ruler={false}
                        barLeftColor="#ebebeb"
                        barRightColor="#ebebeb"
                        barInnerColor="#dd2222"
                        canMinMaxValueSame={true}
                      />
                    </div>
                    <div className="price-values">
                      Rs. {minPrice} - Rs. {maxPrice}
                    </div>
                  </div>
                </div>
                <div className="sidebar__item">
                  <div className="sidebar__filter__checkbox">
                    <input
                      type="checkbox"
                      onChange={(e) => setDiscountedFeature(e.target.checked)}
                    />
                    <label>Discounted</label>
                  </div>
                  <div className="sidebar__filter__checkbox">
                    <input
                      type="checkbox"
                      onChange={(e) => setLatestFeature(e.target.checked)}
                    />
                    <label>Latest</label>
                  </div>
                </div>

                <div className="sidebar__item sidebar__latest__items">
                  <FeaturedSection
                    sectionName="Latest Items"
                    items={latestItemsRes?.item}
                  />
                </div>
              </div>
            </motion.div>

            <div className="col-lg-9 col-md-12">
              {/* <div className="product__discount">
                <div className="section-title product__discount__title">
                  <h2>Sale Off</h2>
                </div>
                <div className="row">
                  <OwlCarousel
                    className="product__discount__slider"
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
                    loop
                    autoplay
                  >
                    {discountedItemsRes?.item.map((i) => (
                      <div className="col-lg-4 item" key={Math.random() * 1000}>
                        <SaleOffItemCard
                          itemId={i._id}
                          image={i.images[0]}
                          name={i.name}
                          originalPrice={i.originalPrice}
                          discountedPrice={i.discountedPrice}
                          discount={i.discount}
                          category={i.category}
                        />
                      </div>
                    ))}
                  </OwlCarousel>
                </div>
              </div> */}
              {/* <div className="product__discount mobile__only__latest__items">
                <div className="section-title product__discount__title">
                  <h2>Latest Items</h2>
                </div>
                <div className="row">
                  <OwlCarousel
                    className="product__discount__slider"
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
                    loop
                    autoplay
                  >
                    {latestItemsRes?.item.map((i) => (
                      <div className="col-lg-4 item" key={Math.random() * 1000}>
                        <SaleOffItemCard
                          itemId={i._id}
                          image={i.images[0]}
                          name={i.name}
                          originalPrice={i.originalPrice}
                          discountedPrice={i.discountedPrice}
                          discount={i.discount}
                          category={i.category}
                        />
                      </div>
                    ))}
                  </OwlCarousel>
                </div>
              </div> */}
              <div className="filter__item">
                <div className="row align-items-center justify-content-between">
                  <div className="col-sm-auto col-xs-auto mobile__open__filter__btn">
                    <button
                      ref={mobileFilterBtn}
                      className=""
                      onClick={() => setMobileFilterVisible(true)}
                    >
                      <FontAwesomeIcon icon={faFilter} />
                    </button>
                  </div>
                  <div className="col-lg-8 col-md-8 col-sm-auto col-xs-auto">
                    <div className="filter__sort">
                      <span>Sort By</span>
                      <ReactSelect
                        options={sortOptions}
                        placeholder="Default"
                        isSearchable={false}
                        className="sort-select"
                        onChange={(e) => sortHandler(e.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 pt-4">
                    <div className="filter__found">
                      <h6>
                        <span>{allItemsRes?.item.length}</span> Products found
                        {department &&
                          department !== "all" &&
                          " in " +
                            department.replace(
                              department[0],
                              department[0].toUpperCase()
                            ) +
                            " department"}
                      </h6>
                    </div>
                  </div>
                  {/* <div className="col-lg-4 col-md-3">
                    <div className="filter__option">
                      <span>
                        <FontAwesomeIcon icon={faGrid} />
                      </span>
                      <span>
                        <FontAwesomeIcon icon={faList} />
                      </span>
                    </div>
                  </div> */}
                </div>
              </div>
              <div className="row shop__items">
                <ContainerLoader isLoading={allItemsIsLoading} />
                {!allItemsIsLoading &&
                  items.map((i) => (
                    <div
                      key={Math.random() * 1000}
                      className="col-lg-4 col-md-6 col-sm-6"
                    >
                      <div className="product__item">
                        <ItemCard
                          itemId={i._id}
                          image={i.images[0]}
                          name={i.name}
                          price={i.discountedPrice}
                          getUser={getUserFunc}
                          wishlist={wishlist}
                          loadWishlist={loadWishlist}
                        />
                      </div>
                    </div>
                  ))}
              </div>
              <div className="product__pagination">
                <a href="#">1</a>
                <a href="#">2</a>
                <a href="#">3</a>
                <a href="#">
                  <i>
                    <FontAwesomeIcon icon={faArrowRight} />
                  </i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Product Section End --> */}
    </>
  );
}
export default Shop;
