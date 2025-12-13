import React, { useEffect, useRef, useState } from "react";

import ReactSelect from "react-select";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faClose,
  faCloudUpload,
  faMinusSquare,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";

import useRequestHandler from "../../hooks/useRequestHandler";
import Loader from "../../components/Loader";

import {
  useCreateItemMutation,
  useGetItemCategoriesQuery,
} from "../../redux/api/itemsApi";

import placeholderImage from "../../assets/placeholder-image.jpg";

function AddNewItem() {
  const [imagesPreview, setImagesPreview] = useState([
    {
      src: placeholderImage,
      name: "No image",
    },
    {
      src: placeholderImage,
      name: "No image",
    },
    {
      src: placeholderImage,
      name: "No image",
    },
    {
      src: placeholderImage,
      name: "No image",
    },
  ]);
  const [itemCategories, setItemCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [existingCategory, setExistingCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [originalPrice, setOriginalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);

  const newItemForm = useRef();
  const imageFileInputRef = useRef();

  const { data } = useGetItemCategoriesQuery({});

  const [createNewItem, { isLoading }] = useCreateItemMutation();

  // For resetting the form inputs
  const resetForm = () => {
    newItemForm.current.reset();
    setItemCategories([]);
    showImagePreview();
    setNewCategory("");
    setDiscount(0);
    setOriginalPrice(0);
    setFinalPrice(0);
  };

  const { triggerMutationFunc: createNewItemHandler } = useRequestHandler({
    mutationFunc: (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      formData.set("category", itemCategories);
      return createNewItem(formData);
    },
    showToastOnError: true,
    showToastOnSuccess: true,
    onSuccess: () => {
      resetForm();
    },
  });

  // Showing image preview when image files are selected
  const showImagePreview = () => {
    const files = imageFileInputRef.current.files;

    const tempFiles = [];
    for (let file of files) {
      const src = URL.createObjectURL(file);

      tempFiles.push({
        src: src,
        name: file.name,
        removeImageHandler: () => {
          console.log(imageFileInputRef.current.files);
          const dataTransfer = new DataTransfer();

          Array.from(files).forEach((f) => {
            if (f !== file) {
              dataTransfer.items.add(f);
            }
          });

          imageFileInputRef.current.files = dataTransfer.files;
          showImagePreview();
        },
      });
    }

    if (tempFiles.length < 4) {
      for (let i = 0; i <= 4 - tempFiles.length; i++) {
        console.log("PUTTING");
        tempFiles.push({
          src: placeholderImage,
          name: "No image",
        });
      }
    }

    setImagesPreview(tempFiles);
  };

  // For adding an existing item category to the new item
  const addExistingCategory = () => {
    if (!itemCategories.includes(existingCategory)) {
      setItemCategories([...itemCategories, existingCategory]);
    } else {
      toast.info("Category is already added");
    }
  };

  // For removing category from the new item
  const removeItemCategory = (e) => {
    const itemCategoryIndex = e.target.getAttribute("data-item-index");

    const temp = [...itemCategories];
    temp.splice(parseInt(itemCategoryIndex), 1);
    setItemCategories(temp);
  };

  // For adding new category
  const addNewCategory = () => {
    if (newCategory.trim() === "") {
      toast.error("Please enter new category name and then click on add");
    } else if (!itemCategories.includes(newCategory)) {
      setItemCategories([
        ...itemCategories,
        newCategory.replace(newCategory[0], newCategory[0].toUpperCase()),
      ]);
      setNewCategory("");
    } else {
      toast.info("Category is already added");
    }
  };

  // For calculating the discounted/final price after original price is changed
  const updateFinalPrice = (originalPrice, discount) => {
    setOriginalPrice(originalPrice);
    setDiscount(discount);
    setFinalPrice(originalPrice - (originalPrice * discount) / 100);
  };

  useEffect(() => {
    if (data) {
      // Converting categories into usable form
      let temp = [];
      data.categories.forEach((i) => {
        temp.push({
          label: i.replace(i[0], i[0].toUpperCase()),
          value: i,
        });
      });

      temp.sort();
      setCategories(temp);
    }
  }, [data]);

  return (
    <>
      <h4 className="admin__dashboard__container__header">Add New Item</h4>
      <Loader isLoading={isLoading} darkBg={false} />

      <div>
        <form
          ref={newItemForm}
          onSubmit={createNewItemHandler}
          className="add__new__item__form"
        >
          <div className="form__field">
            <label>Item Name</label>
            <input placeholder="Enter item name" name="name" />
          </div>
          <div className="form__field">
            <label>Item Description</label>
            <textarea
              placeholder="Enter brief Description of the item"
              rows={4}
              name="description"
            />
          </div>
          <div className="form__field">
            <label>Item Original Price</label>
            <input
              placeholder="Enter original / actual price of item"
              name="originalPrice"
              onChange={(e) => updateFinalPrice(e.target.value, discount)}
            />
          </div>
          <div className="form__field">
            <label>Item Discount</label>
            <input
              placeholder="Enter discount for the item"
              name="discount"
              value={discount}
              type="number"
              onChange={(e) => updateFinalPrice(originalPrice, e.target.value)}
            />
          </div>
          <div className="form__field">
            <label>Item Discounted / Final Price</label>
            <input disabled name="discountedPrice" value={finalPrice} />
          </div>
          <div className="form__field"></div>
          <div className="form__field">
            <label>Item Stock</label>
            <input
              placeholder="Enter the current stock of the item"
              type="number"
              name="stock"
            />
          </div>
          <div className="form__field">
            <label>Weight</label>
            <input
              placeholder="Enter the weight of item"
              type="number"
              name="weight"
            />
          </div>

          <div className="form__field">
            <label>Item Images</label>
            <button type="button">
              <input
                type="file"
                ref={imageFileInputRef}
                onChange={showImagePreview}
                multiple
                accept="image/*"
                name="images"
              />
              <FontAwesomeIcon icon={faCloudUpload} /> Upload Images
            </button>
          </div>
          <div className="form__field">
            <label>Item Images Preview</label>
            <div className="image__preview__container">
              {imagesPreview.map((img) => (
                <div
                  className="image__preview__item"
                  key={Math.random() * 1000}
                >
                  <img src={img.src} />
                  <label className="image__preview__name">{img.name}</label>
                  <i onClick={img.removeImageHandler}>
                    <FontAwesomeIcon icon={faClose} />
                  </i>
                </div>
              ))}
            </div>
          </div>

          <div className="form__field new__item__categories__field">
            <label>Item categories</label>
            <div>
              <input
                placeholder="Add new category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <button onClick={addNewCategory} type="button">
                Add
              </button>
            </div>

            <div>
              <ReactSelect
                options={categories}
                isSearchable={true}
                placeholder="Select from existing categories"
                onChange={(e) =>
                  setExistingCategory(
                    e.value.replace(e.value[0], e.value[0].toUpperCase())
                  )
                }
              />
              <button onClick={addExistingCategory} type="button">
                Add
              </button>
            </div>
            <ul className="new__item__categories__list">
              {itemCategories.map((item) => (
                <li key={Math.random() * 1000}>
                  <i
                    data-item-index={itemCategories.indexOf(item)}
                    onClick={removeItemCategory}
                  >
                    <FontAwesomeIcon icon={faMinusSquare} />
                  </i>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="form__buttons">
            <button className="site-btn" type="submit">
              <i>
                <FontAwesomeIcon icon={faAdd} />
              </i>
              Add Item
            </button>
            <button className="site-btn" onClick={resetForm} type="button">
              <i>
                <FontAwesomeIcon icon={faRefresh} />
              </i>
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddNewItem;
