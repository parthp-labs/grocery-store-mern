import { asyncErrorHandler } from "../middlewares/errorHandler.js";
import { Item } from "../models/Item.js";
import CustomError from "../utils/utilityClasses.js";
import { v2 as cloudinary } from "cloudinary";
import { v4 as uuid } from "uuid";

// CREATE ITEM
export const createItem = asyncErrorHandler(async (req, res, next) => {
  const {
    name,
    description,
    originalPrice,
    stock,
    category,
    discount,
    weight,
  } = req.body;

  if (
    !name ||
    !description ||
    !originalPrice ||
    !stock ||
    !category ||
    !discount ||
    !weight
  ) {
    return next(
      new CustomError(
        "Please provide name, description, originalPrice, stock, category, discount, weight of the item",
        409
      )
    );
  }

  const newItem = Item({
    name,
    description,
    originalPrice,
    stock,
    images: ["1", "2"],
    category: ["default"],
    discount,
    weight,
  });

  await newItem.validate();

  if (!req.files || !req.files.images) {
    return next(new CustomError("Please provide images of the item", 409));
  }

  // Uploading images to cloudinary
  const images = [];
  const errorImages = [];

  try {
    await Promise.all(
      req.files.images.map(async (img) => {
        const extension = img.name.split(".")[1];

        return cloudinary.uploader
          .upload(img.tempFilePath, {
            folder: "/ogani",
            filename_override: `${uuid()}.${extension}`,
          })
          .then((data) => images.push(data.url))
          .catch((err) => {
            errorImages.push(err.message);
            console.log(err);
          });
      })
    );
  } catch {
    const img = req.files.images;
    const extension = img.name.split(".")[1];

    const uploader = await cloudinary.uploader
      .upload(img.tempFilePath, {
        folder: "/ogani",
        filename_override: `${uuid()}.${extension}`,
      })
      .then((data) => images.push(data.url))
      .catch((err) => {
        errorImages.push(err.message);
        console.log(err);
      });
  }

  let categoryList = category;
  categoryList = categoryList.replace("[", "");
  categoryList = categoryList.replace("]", "").trim();
  categoryList = categoryList.replaceAll(`"`, "");
  categoryList = categoryList.replaceAll(" ", "");
  categoryList = categoryList.split(",");

  newItem.category = categoryList;
  newItem.images = images;

  await newItem.save();

  res.status(200).json({
    success: true,
    item: newItem,
    message: "New item has been created",
  });
});

// GET ITEM
export const getItem = asyncErrorHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.itemId);

  if (!item) {
    return next(new CustomError("No item found", 404));
  }

  res.status(200).json({
    success: true,
    item,
  });
});

// GET MANY ITEMS
export const getManyItems = asyncErrorHandler(async (req, res, next) => {
  let {
    id,
    search,
    category,
    minPrice,
    maxPrice,
    minDiscount,
    maxDiscount,
    rating,
    latestItems,
    discountedItems,
    limit,
    page,
  } = req.query;

  // Creating baseQuery for fetching items based on given filters
  let baseQuery = {};

  if (id) {
    baseQuery._id = id;
  }

  if (minPrice || maxPrice) baseQuery["discountedPrice"] = {};
  if (minDiscount || maxDiscount) baseQuery["discount"] = {};

  if (search) {
    baseQuery.name = {
      $regex: search,
      $options: "i",
    };
  }

  if (discountedItems) {
    baseQuery.discount = { $gt: 0 };
  }

  if (category) {
    baseQuery.category = { $in: Array(category) };
  }

  if (minPrice) baseQuery.discountedPrice["$gte"] = Number(minPrice);
  if (maxPrice) baseQuery.discountedPrice["$lte"] = Number(maxPrice);

  if (minDiscount) baseQuery.discount["$gte"] = Number(minDiscount);
  if (maxDiscount) baseQuery.discount["$lte"] = Number(maxDiscount);

  if (rating) baseQuery.rating = { $gte: Number(rating) };

  const skip = ((page || 1) - 1) * limit;
  let items = await Item.find(baseQuery).limit(limit).skip(skip);

  console.log("Base Query for all items");
  console.log(baseQuery);

  res.status(200).json({
    success: true,
    page: page,
    item: items,
  });
});

// GET ITEM BY FEATURE
export const getFeaturedItems = asyncErrorHandler(async (req, res, next) => {
  const featured = req.params.featured;
  const { page, limit } = req.query;

  if (!["latest", "discounted", "rated", "reviewed"].includes(featured)) {
    return next(
      new CustomError(
        "Featured can be latest or discounted or rated or reviewed",
        409
      )
    );
  }

  let reqSort = {};
  let query = {};
  if (featured === "latest") {
    reqSort.addedOn = -1;
  }

  if (featured === "discounted") {
    query.discount = { $gt: 0 };
  }

  if (featured === "rated") {
    query.rating = { $gte: 3 };
  }

  if (featured === "reviewed") {
    query.reviews = { $size: { $gte: 5 } };
  }

  const skip = ((page || 1) - 1) * limit;

  const reqItems = await Item.find(query).sort(reqSort).limit(limit).skip(skip);

  res.status(200).json({
    success: true,
    item: reqItems,
  });
});

// UPDATE ITEM
export const updateItem = asyncErrorHandler(async (req, res, next) => {
  const {
    name,
    description,
    price,
    stock,
    category,
    discount,
    weight,
    removedImages,
  } = req.body;

  // Checking if item exists
  const reqItem = await Item.findById(req.params.itemId);

  if (!reqItem) {
    return next(new CustomError("No item found", 404));
  }

  // Uploading images to cloudinary
  const updatedImages = [];
  if (req.files) {
    const errorImages = [];

    try {
      await Promise.all(
        req.files.images.map(async (img) => {
          const extension = img.name.split(".")[1];

          return cloudinary.uploader
            .upload(img.tempFilePath, {
              folder: "/ogani",
              filename_override: `${uuid()}.${extension}`,
            })
            .then((data) => updatedImages.push(data.url))
            .catch((err) => {
              errorImages.push(err.message);
              console.log(err);
            });
        })
      );
    } catch {
      const img = req.files.images;
      const extension = img.name.split(".")[1];

      const uploader = await cloudinary.uploader
        .upload(img.tempFilePath, {
          folder: "/ogani",
          filename_override: `${uuid()}.${extension}`,
        })
        .then((data) => updatedImages.push(data.url))
        .catch((err) => {
          errorImages.push(err.message);
          console.log(err);
        });
    }
  }

  if (removedImages) {
    reqItem.images.forEach((img) => {
      if (!removedImages.includes(img)) {
        updatedImages.push(img);
      }
    });
  } else {
    updatedImages.push(...reqItem.images);
  }
  console.log(removedImages);
  console.log(reqItem.images);

  // Organizing categories in a array
  let categoryList = category;
  categoryList = categoryList.replace("[", "");
  categoryList = categoryList.replace("]", "").trim();
  categoryList = categoryList.replaceAll(`"`, "");
  categoryList = categoryList.replaceAll(" ", "");
  categoryList = categoryList.split(",");

  let updatedItem = await Item.findByIdAndUpdate(
    req.params.itemId,
    {
      name,
      description,
      images: updatedImages,
      price,
      stock,
      category: categoryList,
      discount,
      weight,
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Item has been successfully updated",
    item: updatedItem,
  });
});

// DELETE ITEM
export const deleteItem = asyncErrorHandler(async (req, res, next) => {
  const deletedItem = await Item.findByIdAndDelete(req.params.itemId);

  console.log(deletedItem);
  if (!deletedItem) {
    return next(new CustomError("No item found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Item has been successfully deleted",
  });
});

// GET ALL CATEGORIES
export const getCategories = asyncErrorHandler(async (req, res, next) => {
  const allItems = await Item.find({});
  const categories = [];

  allItems.forEach((item) => {
    item.category.forEach((cat) => {
      if (!categories.includes(cat)) categories.push(cat);
    });
  });

  res.status(200).json({
    success: true,
    categories: categories,
  });
});
