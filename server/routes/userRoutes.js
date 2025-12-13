import { Router } from "express";
import {
  authenticateUser,
  authorizeAdmin,
} from "../middlewares/authenticate.js";
import {
  addToCart,
  deleteUser,
  getUser,
  loginUser,
  removeFromCart,
  signupUser,
  updateUser,
  deleteUserWithId,
  getAllUsers,
  logoutUser,
  makeUserAdmin,
  verifyUser,
  resendVerificationCode,
} from "../controllers/userController.js";
import { upload } from "../middlewares/multerUpload.js";

const router = Router();

router.route("/user/new").post(signupUser);
router.route("/user/login").post(loginUser);
router.route("/user/logout").post(authenticateUser, logoutUser);
router.route("/user").get(authenticateUser, getUser);
router.route("/user/verify").post(verifyUser);
router.route("/user/send-code").post(resendVerificationCode);
router.route("/user/update").patch(authenticateUser, updateUser);
router.route("/user/delete").delete(authenticateUser, deleteUser);
router.route("/user/cart/add").patch(authenticateUser, addToCart);
router.route("/user/cart/remove").patch(authenticateUser, removeFromCart);

// ADMIN ONLY ROUTES
router.route("/user/all").get(authenticateUser, authorizeAdmin, getAllUsers);
router
  .route("/user/:userId")
  .patch(authenticateUser, authorizeAdmin, updateUser)
  .delete(authenticateUser, authorizeAdmin, deleteUserWithId);

router
  .route("/user/:userId/makeAdmin")
  .patch(authenticateUser, authorizeAdmin, makeUserAdmin);

export default router;
