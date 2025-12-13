import { User } from "../models/User.js";
import { asyncErrorHandler } from "../middlewares/errorHandler.js";
import CustomError from "../utils/utilityClasses.js";
import { Item } from "../models/Item.js";
import mongoose from "mongoose";
import { sendVerificationEmail } from "../utils/sendEmail.js";

// CREATE NEW USER
export const signupUser = asyncErrorHandler(async (req, res, next) => {
  const {
    firstName,
    lastName,
    age,
    gender,
    phoneNumber,
    email,
    password,
    houseNumber,
    streetInfo,
    city,
    pinCode,
    state,
  } = req.body;

  console.log(req.body);
  let newUser = User({
    firstName,
    lastName,
    age,
    gender: gender ? gender.toLowerCase() : null,
    phoneNumber,
    email,
    password,
    houseNumber,
    streetInfo,
    city,
    pinCode,
    state,
    cart: {},
  });

  // Checking if user already exists
  const existingUser = await User.findOne({ email: email });

  const verificationCode = await newUser.generateVerificationCode();

  newUser = await newUser.save();

  delete newUser.password;

  // Sending the verification code to user via email
  const sendEmail = await sendVerificationEmail(
    `${newUser.firstName} ${newUser.lastName}`,
    email,
    verificationCode
  );

  // Sending response when email was not sent
  if (!sendEmail) {
    return res.status(201).json({
      success: true,
      emailSent: false,
      message:
        "User created but verification email cannot be sent. Please visit verification page to resend it.",
    });
  }

  res.status(200).json({
    success: true,
    emailSent: true,
    message: "New user has been created",
    user: newUser,
  });
});

// VERIFY USER
export const verifyUser = asyncErrorHandler(async (req, res, next) => {
  const { verificationCode } = req.body;

  if (!verificationCode) {
    return next(new CustomError("Please provide the verification code", 400));
  }

  const user = await User.findOne({ verificationCode });

  if (!user) {
    return next(new CustomError("Invalid verification code", 400));
  }

  if (user.verified === false) {
    if (new Date(user.verificationCodeExpires).getTime() > Date.now()) {
      user.verified = true;
      user.verificationCodeExpires = null;

      await user.save();

      return res.status(200).json({
        success: true,
        message: "User successfully verified. Continue to login",
      });
    } else {
      return next(new CustomError("User email is already verified", 200));
    }
  } else {
    return next(new CustomError("User is already verified", 409));
  }
});

// LOGIN USER
export const loginUser = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Checking if user exists
  const user = await User.findOne({ email });

  if (!user) {
    return next(new CustomError("No user found", 404));
  }

  if (user.verified == false) {
    return next(
      new CustomError(
        "User email is not verified. Please verify your email",
        401
      )
    );
  }

  // Comparing password
  // const passwordMatch = await user.comparePassword(password);
  console.log(user);
  console.log(password);

  if (user.password !== password) {
    return next(new CustomError("Invalid credentials", 501));
  }

  // Generating JWT and adding it to the cookie
  const jwt = await user.generateJWT();
  res.cookie("token", jwt, {
    expires: new Date(Date.now() + 86400000),
  });

  res
    .status(200)
    .json({ success: true, message: "Logged in successfully", token: jwt });
});

// RESEND VERIFICATION CODE
export const resendVerificationCode = asyncErrorHandler(
  async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
      return next(
        new CustomError("Email is required to send verification code", 401)
      );
    }

    const reqUser = await User.findOne({ email });

    if (!reqUser) {
      return next(
        new CustomError(
          "User does not exists with the given email. Please signup",
          404
        )
      );
    }

    if (reqUser.verified) {
      return next(new CustomError("User is already verified", 409));
    }

    await reqUser.generateVerificationCode();

    await reqUser.save();
    const sendEmail = await sendVerificationEmail(
      `${reqUser.firstName} ${reqUser.lastName}`,
      email,
      reqUser.verificationCode
    );

    if (!sendEmail) {
      return next(new CustomError("Email was not sent. Please try again", 500));
    }

    res.status(200).json({
      success: true,
      message: "Email successfully sent",
    });
  }
);

// LOGOUT USER
export const logoutUser = asyncErrorHandler(async (req, res, next) => {
  res.cookie("token", null, { expires: new Date() });

  res.status(200).json({
    success: true,
    message: "Successfully logged out",
  });
});

// GET USER
export const getUser = asyncErrorHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// UPDATE USER
export const updateUser = asyncErrorHandler(async (req, res, next) => {
  const {
    firstName,
    lastName,
    age,
    gender,
    phoneNumber,
    houseNumber,
    streetInfo,
    pinCode,
    city,
    state,
  } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      firstName,
      lastName,
      age,
      gender,
      phoneNumber,
      houseNumber,
      streetInfo,
      pinCode,
      city,
      state,
    },
    { new: true }
  );

  return res.status(200).json({
    success: true,
    message: "Successfully updated the user",
    user: updatedUser,
  });
});

// DELETE USER
export const deleteUser = asyncErrorHandler(async (req, res, next) => {
  const deletedUser = await User.deleteOne({ _id: req.user._id });

  return res
    .status(200)
    .json({ success: true, message: "Successfully deleted the user" });
});

// ADD TO CART
export const addToCart = asyncErrorHandler(async (req, res, next) => {
  const { itemId, quantity } = req.body;

  if (!itemId || !quantity) {
    return next(
      new CustomError("Please provide a valid itemId and quantity", 401)
    );
  }
  // Checking if item exists
  const reqItem = await Item.findById(itemId);

  if (!reqItem) {
    return next(new CustomError("No item found", 404));
  }

  if (req.user.cart.items.length === 0) {
    req.user.cart.items.push({ item: itemId, quantity });
  } else {
    for (let i of req.user.cart.items) {
      console.log(i.item._id.toString());
      console.log(itemId);
      // Incrementing the quantity of the item when item already exists in cart
      if (i.item._id.toString() === itemId) {
        i.quantity += quantity;
        await req.user.save();
        break;
      } else {
        // Adding item to the cart when it is not already in the cart
        if (req.user.cart.items.indexOf(i) === req.user.cart.items.length - 1) {
          req.user.cart.items.push({ item: itemId, quantity });
        }
      }
    }
  }

  await req.user.save();

  res.status(200).json({
    success: true,
    message: "Item has been added to the cart",
    cart: req.user.cart,
  });
});

// REMOVE FROM CART
export const removeFromCart = asyncErrorHandler(async (req, res, next) => {
  const { itemId, quantity } = req.body;

  for (let item of req.user.cart.items) {
    if (item.item._id.toString() === itemId) {
      if (item.quantity - quantity == 0) {
        req.user.cart.items.splice(req.user.cart.items.indexOf(item), 1);

        await req.user.save();
        return res.status(200).json({
          success: true,
          cart: req.user.cart,
          message: "Item has been removed from the cart",
        });
      } else if (item.quantity < quantity || item.quantity < 0) {
        return next(new CustomError("Quantity cannot be negative", 409));
      } else {
        item.quantity -= quantity;

        await req.user.save();
        return res.status(200).json({
          success: true,
          cart: req.user.cart,
          message: "Item quantity has been successfully updated",
        });
      }
    }
  }

  return next(new CustomError("No item found", 404));
});

// ADMIN ONLY
// GET ALL USERS
export const getAllUsers = asyncErrorHandler(async (req, res, next) => {
  const { userId, name, email, gender, role } = req.query;

  // Creating filter query based on provided query values in url
  let filterQuery = {};

  if (name) filterQuery.name = { $regex: name, $options: "i" };

  if (userId) filterQuery._id = userId;

  if (email) filterQuery.email = { $regex: email, $options: "i" };

  if (gender) filterQuery.gender = gender;

  if (role) filterQuery.role = role;

  console.log(filterQuery);
  const users = await User.find(filterQuery);

  res.status(200).json({
    success: true,
    user: users,
  });
});

// DELETE USER WITH GIVEN ID
export const deleteUserWithId = asyncErrorHandler(async (req, res, next) => {
  if (reqUser === req.user._id) {
    return next(new CustomError("You cannot delete your self as an admin"));
  }

  const reqUser = await User.findByIdAndDelete(req.params.userId);

  if (!reqUser) {
    return next(new CustomError("No user found", 404));
  }

  res.status(200).json({
    success: true,
    message: "User has been successfully deleted",
  });
});

// MAKING USER TO ADMIN
export const makeUserAdmin = asyncErrorHandler(async (req, res, next) => {
  const reqUser = await User.findById(req.params.userId);

  if (reqUser.role === "admin") {
    return res.status(200).json({
      success: true,
      message: "User is already admin",
    });
  }

  reqUser.role = "admin";
  await reqUser.save();

  res.status(200).json({
    success: true,
    message: "User has been made admin",
  });
});
