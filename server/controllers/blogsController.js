import { Blogs } from "../models/Blogs.js";
import { asyncErrorHandler } from "../middlewares/errorHandler.js";
import CustomError from "../utils/utilityClasses.js";
import { v2 as cloudinary } from "cloudinary";
import { v4 as uuid } from "uuid";

// CREATE NEW BLOG
export const createBlog = asyncErrorHandler(async (req, res, next) => {
  let { title, description, tags } = req.body;

  // Checking if one tag is provided more than once
  if (!tags || !title || !description) {
    return next(
      new CustomError(
        "Please provide a valid title, description and tags for the blo"
      )
    );
  }

  if (typeof tags === "string") {
    tags = tags
      .replace("[", "")
      .replace("]", "")
      .replaceAll(`"`, "")
      .trim()
      .split(",");
  }

  tags.forEach((tag) => {
    let temp = tags.slice();
    temp.splice(temp.indexOf(tag), 1);

    if (temp.includes(tag)) {
      return next(
        new CustomError(
          `${tag} is already present in tags list for the blog`,
          409
        )
      );
    }
  });

  // Uploading blog image
  if (!req.files || !req.files.image) {
    return next(new CustomError("Please provide a blog image", 409));
  }

  const image = req.files.image;
  const imageUpload = await cloudinary.uploader.upload(image.tempFilePath, {
    filename_override: `${uuid()}.${image.extension}`,
    folder: "ogani",
  });

  const blog = Blogs({
    image: imageUpload.url,
    title,
    description,
    tags,
    createdBy: req.user._id,
  });

  await blog.save();
  await blog.populate("comments.commentedBy createdBy");

  res.status(200).json({
    success: true,
    message: "New blog has been created",
    blog: blog,
  });
});

// GET A BLOG
export const getBlog = asyncErrorHandler(async (req, res, next) => {
  const reqBlog = await Blogs.findById(req.params.blogId).populate(
    "comments.commentedBy createdBy"
  );

  if (!reqBlog) {
    return new CustomError("No blog found", 404);
  }

  res.status(200).json({
    success: true,
    blog: reqBlog,
  });
});

// GET ALL BLOGS
export const getAllBlogs = asyncErrorHandler(async (req, res, next) => {
  let { id, tag, title, page, limit } = req.query;

  const baseQuery = {};
  if (id) {
    baseQuery._id = id;
  }

  if (tag) {
    tag = tag.split(",");
    console.log(tag.length);
    if (tag.length !== 1) {
      baseQuery.tags = tag;
    } else {
      baseQuery.tags = {
        $in: tag[0].toLowerCase(),
      };
    }
  }

  if (title) {
    baseQuery.title = {
      $regex: title,
      $options: "i",
    };
  }

  console.log(baseQuery);

  const skip = ((page || 1) - 1) * limit;

  const reqBlogs = await Blogs.find(baseQuery)
    .populate("comments.commentedBy createdBy")
    .limit(limit || 10)
    .skip(skip);

  res.status(200).json({
    success: true,
    blog: reqBlogs,
  });
});

// UPDATE A BLOG
export const updateBlog = asyncErrorHandler(async (req, res, next) => {
  const { title, description, tags } = req.body;
  const image = req.files?.image;

  const reqBlog = await Blogs.findById(req.params.blogId).populate(
    "comments.commentedBy createdBy"
  );

  if (!reqBlog) {
    return next(new CustomError("No blog found", 404));
  }

  // if (image) {
  //   const upload = await cloudinary.uploader.upload(image, {
  //     folder: "ogani",
  //     filename_override: `${uuid()}.${image.extension}`,
  //   });

  //   req.image = upload.url;
  // }

  reqBlog.title = title;
  reqBlog.description = description;
  reqBlog.tags = tags;

  await reqBlog.save();

  res.status(200).json({
    success: true,
    message: "Blog has been updated",
    blog: reqBlog,
  });
});

// DELETE A BLOG
export const deleteBlog = asyncErrorHandler(async (req, res, next) => {
  const reqBlog = await Blogs.findByIdAndDelete(req.params.blogId);

  console.log(reqBlog);
  if (!reqBlog) {
    return next(new CustomError("No blog found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Blog has been deleted",
  });
});

// GET RECENT BLOGS
export const getRecentBlogs = asyncErrorHandler(async (req, res, next) => {
  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 4);
  console.log(tenDaysAgo);
  const reqBlogs = await Blogs.find({ createdOn: { $gte: tenDaysAgo } });
  return res.status(200).json({
    success: true,
    blog: reqBlogs,
  });
});

// GET ALL BLOGS TAGS
export const getAllBlogTags = asyncErrorHandler(async (req, res, next) => {
  const blogs = await Blogs.find({});

  let tagsList = [];
  blogs.forEach((blog) => {
    blog.tags.forEach((tag) => {
      if (!tagsList.includes(tag)) {
        tagsList.push(tag);
      }
    });
  });

  res.status(200).json({
    success: true,
    tags: tagsList,
  });
});
