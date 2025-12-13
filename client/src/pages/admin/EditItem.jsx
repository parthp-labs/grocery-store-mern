import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import ReactSelect from "react-select";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faCloudUpload,
  faEdit,
  faMinusSquare,
} from "@fortawesome/free-solid-svg-icons";

import useRequestHandler from "../../hooks/useRequestHandler";
import Loader from "../../components/Loader";

import {
  useEditItemMutation,
  useLazyGetItemByIdQuery,
  useLazyGetItemCategoriesQuery,
} from "../../redux/api/itemsApi";

import placeholderImage from "../../assets/placeholder-image.jpg";

function EditItem() {
  const params = useParams();

  const imageFileInputRef = useRef();
  const updateItemFormRef = useRef();

  const [itemDetails, setItemDetails] = useState({});
  const [itemCategories, setItemCategories] = useState([]);
  const [existingCategory, setExistingCategory] = useState([]);
  const [selectedExistingCategory, setSelectedExistingCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [deletedImages, setDeletedImages] = useState([]);
  const [newImagesPreview, setNewImagesPreview] = useState([]);
  const [addedImagesPreview, setAddedImagesPreview] = useState([]);

  const itemId = params.itemId;

  const [editItemHandler, { isLoading: editItemLoading }] =
    useEditItemMutation();
  const [getItemData, { data: itemData, isLoading: itemDataLoading }] =
    useLazyGetItemByIdQuery();

  const [
    getItemCategories,
    { data: allItemCategories, isLoading: allItemCategoriesLoading },
  ] = useLazyGetItemCategoriesQuery({});
  const { triggerMutationFunc: updateItemHandler } = useRequestHandler({
    mutationFunc: (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      formData.set("removedImages", deletedImages);
      formData.set("category", itemCategories);
      return editItemHandler({ itemId, body: formData });
    },
    showToastOnError: true,
    showToastOnSuccess: true,
    onSuccess: () => {
      updateItemFormRef.current.reset();
      setNewImagesPreview([]);
      getItemData(itemId);
      getItemCategories();
    },
  });

  // For adding new category
  const addNewCategory = () => {
    if (newCategory.trim() === "") {
      toast.error("Please enter new category name and then click on add");
    } else if (!itemCategories.includes(newCategory)) {
      setItemCategories([...itemCategories, newCategory]);
      setNewCategory("");
    } else {
      toast.info("Category is already added");
    }
  };

  // For adding an existing item category to the new item
  const addExistingCategory = () => {
    if (!itemCategories.includes(selectedExistingCategory)) {
      setItemCategories([...itemCategories, selectedExistingCategory]);
      console.log([...itemCategories, selectedExistingCategory]);
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

  // For removing item image
  const removeFromOldImages = (img) => {
    let newImages = [...addedImagesPreview];
    newImages.splice(newImages.indexOf(img), 1);
    setAddedImagesPreview(newImages);
    setDeletedImages([...deletedImages, img.src]);
  };

  // For showing new images preview that are being added to item
  const showNewImagesPreview = () => {
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
        },
      });
    }

    // if (tempFiles.length < 4) {
    //   for (let i = 0; i <= 4 - tempFiles.length; i++) {
    //     console.log("PUTTING");
    //     tempFiles.push({
    //       src: placeholderImage,
    //       name: "No image",
    //     });
    //   }
    // }
    setNewImagesPreview(tempFiles);
  };

  useEffect(() => {
    if (allItemCategories) {
      // Converting categories into usable form
      const temp = [];
      allItemCategories.categories.forEach((i) => {
        temp.push({
          label: i.replace(i[0], i[0].toUpperCase()),
          value: i,
        });
      });
      setExistingCategory(temp);
    }
  }, [allItemCategories, allItemCategoriesLoading]);

  useEffect(() => {
    if (itemData) {
      setItemDetails(itemData.item);
      setItemCategories(itemData.item.category);

      const tempImages = [];
      itemData.item.images.forEach((img) => {
        const urlSplit = img.split("/");

        tempImages.push({ src: img, name: urlSplit[urlSplit.length - 1] });
      });

      setAddedImagesPreview(tempImages);
    }
  }, [itemData, itemDataLoading]);

  useEffect(() => {
    getItemData(itemId);
    getItemCategories();
  }, []);

  return (
    <>
      <h4 className="admin__dashboard__container__header">Edit Item</h4>
      <Loader isLoading={editItemLoading} darkBg={false} />
      <div>
        <form
          className="edit__item__form"
          encType="multipart/form-data"
          onSubmit={updateItemHandler}
          ref={updateItemFormRef}
        >
          <div className="form__field">
            <label>Item Name</label>
            <input
              placeholder="Enter item name"
              name="name"
              defaultValue={itemDetails.name}
            />
          </div>
          <div className="form__field">
            <label>Item Description</label>
            <textarea
              placeholder="Enter brief Description of the item"
              rows={4}
              name="description"
              defaultValue={itemDetails.description}
            />
          </div>
          <div className="form__field">
            <label>Item Original Price</label>
            <input
              placeholder="Enter original / actual price of item"
              name="originalPrice"
              defaultValue={itemDetails.originalPrice}
            />
          </div>
          <div className="form__field">
            <label>Item Discount</label>
            <input
              placeholder="Enter discount for the item"
              name="discount"
              defaultValue={itemDetails.discount}
            />
          </div>
          <div className="form__field">
            <label>Item Discounted / Final Price</label>
            <input
              disabled
              name="discountedPrice"
              defaultValue={itemDetails.discountedPrice}
            />
          </div>
          <div className="form__field"></div>
          <div className="form__field">
            <label>Item Stock</label>
            <input
              placeholder="Enter the current stock of the item"
              type="number"
              name="stock"
              defaultValue={itemDetails.stock}
            />
          </div>
          <div className="form__field">
            <label>Weight</label>
            <input
              placeholder="Enter the weight of item"
              type="number"
              name="weight"
              defaultValue={itemDetails.weight}
            />
          </div>
          <div className="form__field">
            <label>Item Images</label>
            <button type="button">
              <input
                type="file"
                ref={imageFileInputRef}
                onChange={showNewImagesPreview}
                multiple
                accept="image/*"
                name="images"
              />
              <FontAwesomeIcon icon={faCloudUpload} /> Upload Images
            </button>
          </div>
          <div className="form__field">
            <label>Added Images</label>
            <div className="image__preview__container">
              {addedImagesPreview.length == 0 && <h6>No Images</h6>}
              {addedImagesPreview.map((img) => (
                <div
                  className="image__preview__item"
                  key={Math.random() * 1000}
                >
                  <img src={img.src} />
                  {/* <label className="image__preview__name">{img.name}</label> */}
                  <i onClick={() => removeFromOldImages(img)}>
                    <FontAwesomeIcon icon={faClose} />
                  </i>
                </div>
              ))}
            </div>
            <label>New Images</label>
            <div className="image__preview__container">
              {newImagesPreview.map((img) => (
                <div
                  className="image__preview__item"
                  key={Math.random() * 1000}
                >
                  <img src={img.src} />
                  <label className="image__preview__name">{img.name}</label>
                </div>
              ))}
              {Array(4 - newImagesPreview.length)
                .fill()
                .map(() => (
                  <div
                    className="image__preview__item"
                    key={Math.random() * 1000}
                  >
                    <img src={placeholderImage} />
                    {/* <label className="image__preview__name">{img.name}</label> */}
                    {/* <i onClick={() => removeItemImage(img)}>
                    <FontAwesomeIcon icon={faClose} />
                  </i> */}
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
                onChange={(e) => {
                  setNewCategory(
                    e.target.value.replace(
                      e.target.value[0],
                      e.target.value[0].toUpperCase()
                    )
                  );
                }}
              />
              <button type="button" onClick={addNewCategory}>
                Add
              </button>
            </div>

            <div>
              <ReactSelect
                options={existingCategory}
                isSearchable={true}
                placeholder="Select from existing categories"
                onChange={(e) =>
                  setSelectedExistingCategory(
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
                <FontAwesomeIcon icon={faEdit} />
              </i>
              Edit Item
            </button>
            {/* <button className="site-btn" onClick={resetForm} type="button">
              <i>
                <FontAwesomeIcon icon={faRefresh} />
              </i>
              Reset Form
            </button> */}
          </div>
        </form>
      </div>
    </>
  );
}

export default EditItem;
