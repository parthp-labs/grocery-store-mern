import { User } from "../models/User.js";
import CustomError from "../utils/utilityClasses.js";
import jwt from "jsonwebtoken";

export const authenticateUser = async (req, res, next) => {
  let token;
  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization) {
    token = req.headers.authorization.replace("Bearer", "").trim();
  }

  if (!token) {
    return next(
      new CustomError("Invalid credentials. Please login to continue", 401)
    );
  }

  const payload = jwt.decode(token);

  if (!payload) {
    return next(new CustomError("Please login to continue.", 401));
  }
  let user = await User.findById(payload.id).populate("cart.items.item");

  if (!user) {
    return next(new CustomError("No user found", 404));
  }
  user.cart.items = user.cart.items.filter((item) => item.item !== null);

  req.user = user;
  next();
};

export const authorizeAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new CustomError("Unauthorized access", 401));
  }
  next();
};
