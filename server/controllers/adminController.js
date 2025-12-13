import { asyncErrorHandler } from "../middlewares/errorHandler.js";
import { User } from "../models/User.js";
import CustomError from "../utils/utilityClasses.js";

// GET ALL USERS
export const getAllUsers = asyncErrorHandler(async (req, res, next) => {
  const users = await User.find({}).select("-password");

  res.status(200).json({
    success: true,
    user: users,
  });
});

// DELETE USER WITH A GIVEN ID
export const deleteUserById = asyncErrorHandler(async (req, res, next) => {
  const userId = req.params.userId;

  const deletedUser = await User.findByIdAndDelete(userId);

  if (!deletedUser) {
    return next(new CustomError("No user found", 404));
  }

  res.status(200).json({
    success: true,
    message: "User has been successfully deleted",
  });
});

// MAKING USER TO ADMIN
export const makeUserAdmin = asyncErrorHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
    role: "admin",
  });

  if (!updatedUser) {
    return next(new CustomError("No user found"), 404);
  }

  res.status(200).json({
    success: true,
    message: "User has been made admin",
  });
});
