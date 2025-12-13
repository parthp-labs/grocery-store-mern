import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, "Please provide a valid url of the image"],
  },
  publicId: {
    type: String,
    required: [true, "Please provide a valid publicId of the image"],
  },
});

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a valid item name"],
    unique: [true, "Please provide a unique item name"],
    validate: [
      {
        validator: async (val) => {
          const countDocument = await mongoose.models.Item.countDocuments({
            name: val,
          });
          return countDocument == 0;
        },
        message: "Please provide a unique item name",
      },
    ],
  },
  description: {
    type: String,
    required: [true, "Please provide a valid item description"],
  },
  category: {
    type: [
      {
        type: String,
      },
    ],
    validate: [
      {
        validator: (val) => {
          return val.length >= 1;
        },
        message: "Must have minimum 1 category",
      },
    ],
  },
  originalPrice: {
    type: Number,
    required: [true, "Please provide a valid original price of the item"],
  },
  discountedPrice: {
    type: Number,
  },
  discount: {
    type: Number,
    default: 0,
  },
  images: {
    type: [
      {
        type: String,
        required: [true, "Please provide a valid image name"],
      },
    ],
    validate: [(val) => val.length >= 1, "Must have minimum 1 image"],
  },
  stock: {
    type: Number,
    default: 1,
  },
  sales: {
    type: Number,
    default: 0,
  },
  weight: {
    type: Number,
    required: [true, "Please provide a valid weight of the item in kg"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  addedOn: {
    type: Date,
    default: Date.now,
  },
  reviews: {
    type: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: [true, "Please provide the id of the user"],
        },
        review: {
          type: String,
          required: [true, "Please provide a valid review"],
        },
      },
    ],
  },
});

// CALCULATING DISCOUNTED PRICE
itemSchema.pre("save", function (next) {
  const saving = (this.discount * this.originalPrice) / 100;
  this.discountedPrice = this.originalPrice - saving;

  this.category.forEach((cat) => {
    cat = cat.toLowerCase();
  });

  next();
});

export const Item = mongoose.model("Item", itemSchema);
