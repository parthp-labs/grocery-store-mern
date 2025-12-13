import mongoose from "mongoose";

const commentsSchema = new mongoose.Schema({
  commentedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Please provide a valid id in commentedBy"],
  },
  comment: {
    type: String,
    required: [true, "Please provide a valid comment"],
  },
  commentedOn: {
    type: Date,
    default: Date.now,
  },
});

const blogsSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  image: {
    type: String,
    required: [true, "Please provide the image of the blog"],
  },
  title: {
    type: String,
    required: [true, "Please provide a valid blog title"],
    unique: [true, "Please provide a unique blog title"],
  },
  description: {
    type: String,
    required: [true, "Please provide a valid blog description"],
  },
  comments: [commentsSchema],
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  tags: {
    type: Array,
    validate: [
      {
        validator: async function (givenTab) {
          return this.tags.length > 0;
        },
        message: (validationObj) => {
          return `Blog should have minimum of 1 tag`;
        },
      },
    ],
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

blogsSchema.pre("save", function (next) {
  this.tags.forEach((tag) => {
    tag = tag.toLowerCase();
  });

  next();
});

export const Blogs = mongoose.model("Blogs", blogsSchema);
