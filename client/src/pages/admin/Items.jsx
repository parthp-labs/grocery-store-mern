import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ReactSelect from "react-select";
import MultiRangeSlider from "multi-range-slider-react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare, faRefresh } from "@fortawesome/free-solid-svg-icons";

import useRequestHandler from "../../hooks/useRequestHandler";

import TableLoader from "../../components/TableLoader";
import ItemsTableComponent from "../../components/admin/ItemsTableComponent";

import {
  useGetItemCategoriesQuery,
  useGetItemsQuery,
  useLazyGetItemsQuery,
  useRemoveItemMutation,
} from "../../redux/api/itemsApi";

function Items() {
  const navigate = useNavigate();
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [itemId, setItemId] = useState();
  const [itemName, setItemName] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [itemsList, setItemsList] = useState([]);

  const { data: itemCategoriesQuery, isError: isItemCategoriesError } =
    useGetItemCategoriesQuery();
  const { data, isError, isLoading } = useGetItemsQuery({
    minPrice,
    maxPrice,
    category: selectedCategory,
    itemId,
    search: itemName,
  });
  const [triggerGetItems] = useLazyGetItemsQuery();

  const [removeItem] = useRemoveItemMutation();
  const { triggerMutationFunc: removeItemHandler } = useRequestHandler({
    mutationFunc: (itemId) => removeItem(itemId),
    showToastOnError: true,
    showToastOnSuccess: true,
    onSuccess: () =>
      triggerGetItems({
        minPrice,
        maxPrice,
        category: selectedCategory,
        itemId,
        search: itemName,
      }),
  });

  const priceRangeHandler = (event) => {
    setMaxPrice(event.maxValue);
    setMinPrice(event.minValue);
  };

  const resetFilter = () => {
    setMinPrice(priceRange[0]);
    setMaxPrice(priceRange[1]);
    setItemId("");
    setSelectedCategory("");
    setItemName("");
  };

  useEffect(() => {
    if (itemCategoriesQuery) {
      const tempCategories = [
        {
          value: "",
          label: "All",
        },
      ];
      itemCategoriesQuery.categories.forEach((category) => {
        tempCategories.push({
          value: category,
          label: category.replace(category[0], category[0].toUpperCase()),
        });
      });

      setCategoryOptions(tempCategories);
    }
  }, [itemCategoriesQuery, isItemCategoriesError]);

  useEffect(() => {
    if (data) {
      setItemsList(data.item);
    }
    if (isError) {
      setItemsList([]);
    }
  }, [data, isError]);

  return (
    <>
      <>
        <button className="site-btn" onClick={resetFilter}>
          <i>
            <FontAwesomeIcon icon={faRefresh} />
          </i>
          Reset Filters
        </button>
        <Link to="/admin/items/new" className="site-btn">
          <i>
            <FontAwesomeIcon icon={faPlusSquare} />
          </i>
          Add New Item
        </Link>
        <div className="admin__items__filter">
          <div className="filter__input">
            <label>Id</label>
            <input
              placeholder="Enter item id"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
            />
          </div>
          <div className="filter__input">
            <label>Name</label>
            <input
              placeholder="Enter item name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>
          <div className="filter__input">
            <label>Category</label>
            <ReactSelect
              placeholder="Select category"
              options={categoryOptions}
              isSearchable={true}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.value)}
            />
          </div>
          <div className="filter__input range__input">
            <label>
              <span>Min Price</span>
              <br /> Rs.{minPrice}
            </label>

            <MultiRangeSlider
              minValue={0}
              maxValue={500}
              step={5}
              min={minPrice}
              max={maxPrice}
              onInput={(e) => priceRangeHandler(e)}
              style={{
                border: "none",
                boxShadow: "none",
                padding: "10px 2px",
                width: "100%",
              }}
              label={true}
              ruler={false}
              barLeftColor="#ebebeb"
              barRightColor="#ebebeb"
              barInnerColor="#dd2222"
              canMinMaxValueSame={true}
            />
            <div className="range__values">
              <label>
                <span>Max Price</span>
                <br /> Rs.{maxPrice}
              </label>
            </div>
          </div>
        </div>
        <table className="admin__items__table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Image</th>
              <th>Name</th>
              <th>Original Price</th>
              <th>Final Price</th>
              <th>Stock</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableLoader />
            ) : (
              itemsList.map((i) => (
                <ItemsTableComponent
                  key={i._id}
                  id={i._id}
                  name={i.name}
                  image={i.images[0]}
                  originalPrice={i.originalPrice}
                  finalPrice={i.discountedPrice}
                  stock={i.stock}
                  categories={i.category}
                  editItemHandler={() => navigate(`/admin/items/${i._id}/edit`)}
                  removeItemHandler={() => removeItemHandler(i._id)}
                />
              ))
            )}
          </tbody>
        </table>
      </>
    </>
  );
}

export default Items;
