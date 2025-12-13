import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const cartSchema = new mongoose.Schema({
  items: [
    {
      item: {
        type: mongoose.Schema.ObjectId,
        ref: "Item",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  cartTotal: {
    type: Number,
    default: 0,
  },
});

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  firstName: {
    type: String,
    required: [true, "Please provide first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please provide last name"],
  },
  age: {
    type: Number,
    required: [true, "Please provide a valid age"],
    validate: {
      validator: function (v) {
        return 15 <= v && v <= 99;
      },
      message: "Age should be between 15 and 99",
    },
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: [true, "Please provide a valid gender (male, female or other)"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please provide a valid phone number"],
    validate: {
      validator: function (d) {
        return d.length == 10;
      },
      message: "Phone number should be of length 10",
    },
  },
  email: {
    type: String,
    required: [true, "Please provide a valid email"],
    unique: [true, "Please provide a unique email"],
    validate: {
      validator: function (d) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/.test(d);
      },
      message: "Please enter a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide a valid password"],
    validate: {
      validator: function (d) {
        return d.length >= 5;
      },
      message: "Password should be of minimum length 5",
    },
  },
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
  cart: {
    type: cartSchema,
  },
  verificationCode: {
    type: String,
  },
  verificationCodeExpires: {
    type: Date,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  // CONVERTING PASSWORD INTO HASH BEFORE SAVING
  // const hash = await bcrypt.hash(this.password, 10);
  // this.password = hash;

  this.gender = this.gender.toLowerCase();
  this.firstName[0].toUpperCase();
  this.lastName[0].toUpperCase();

  // CALCULATING CART TOTAL
  let total = 0;

  await this.populate("cart.items.item");
  console.log(this.cart.items);
  this.cart.items.forEach((i) => {
    total += Math.round(Number(i.item.discountedPrice) * Number(i.quantity));
  });
  console.log("HEllo");
  console.log(total);

  this.cart.cartTotal = total;

  next();
});

// GENERATING JSON WEB TOKEN FOR THE USER
userSchema.methods.generateJWT = async function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET);
};

// FOR COMPARING PASSWORD
userSchema.methods.comparePassword = async function (givenPassword) {
  return await bcrypt.compare(givenPassword, this.password);
};

// Generating code for email confirmation
userSchema.methods.generateVerificationCode = async function () {
  const code = Math.floor(100000 + Math.random() * 900000);

  this.verificationCode = code;
  this.verificationCodeExpires = new Date(Date.now() + 86400000);
  return code;
};

userSchema.methods.verifyUserEmail = async function (code) {
  const checkIfExist = await mongoose.models.User.countDocuments({
    verificationCode: code,
  });

  if (checkIfExist !== 0) {
    this.verify = true;
    this.verificationCode = null;
    this.verificationCodeExpires = null;

    return true;
  } else {
    return false;
  }
};

export const User = mongoose.model("User", userSchema);
