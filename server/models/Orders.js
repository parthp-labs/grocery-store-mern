import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
  },
  paymentMode: {
    type: String,
    enum: ["card", "cashOnDelivery"],
  },
  status: {
    type: String,
    enum: ["success", "failed"],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Please provide a valid id in customer"],
  },
  orderItems: [
    {
      itemId: {
        type: mongoose.Schema.ObjectId,
        ref: "Item",
        required: [true, "Please provide a valid itemId of the item"],
      },
      quantity: {
        type: Number,
        required: [true, "Please provide a valid item quantity"],
      },
      name: {
        type: String,
        required: [true, "Please provide a valid item name"],
      },
      description: {
        type: String,
        required: [true, "Please provide a valid item description"],
      },
      category: {
        type: Array,
        required: [true, "Please provide item category"],
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
      images: [],
      weight: {
        type: Number,
        required: [true, "Please provide a valid weight of the item"],
      },
      rating: {
        type: Number,
        default: 0,
      },
    },
  ],
  deliveryAddress: {
    houseNumber: {
      type: String,
      required: [true, "Please provide a valid house number"],
    },
    streetInfo: {
      type: String,
      required: [true, "Please provide a valid street info"],
    },
    pinCode: {
      type: Number,
      required: [true, "Please provide a valid pinCode"],
    },
    city: {
      type: String,
      required: [true, "Please provide a valid city"],
    },
    state: {
      type: String,
      required: [true, "Please provide a valid state"],
    },
  },
  subTotal: {
    type: Number,
    required: [true, "Please provide a valid subTotal"],
  },
  tax: {
    type: Number,
  },
  deliveryCharges: {
    type: Number,
    required: [true, "Please provide a valid deliveryCharges"],
  },
  totalAmount: {
    type: Number,
    required: [true, "Please provide a valid totalAmount"],
  },
  payment: paymentSchema,
  status: {
    type: String,
    enum: ["pending", "processing", "delivered", "cancelled"],
    default: "pending",
  },
  orderedOn: {
    type: Date,
    default: Date.now,
  },
  sessionId: {
    type: String,
    required: [true, "Please provide the session id"],
  },
  deliveredOn: {
    type: Date,
  },
});

export const Order = mongoose.model("Order", orderSchema);
