import { Router } from "express";
import { upload } from "../middlewares/multerUpload.js";
import {
  authenticateUser,
  authorizeAdmin,
} from "../middlewares/authenticate.js";
import {
  createItem,
  deleteItem,
  getFeaturedItems,
  getItem,
  getManyItems,
  updateItem,
  getCategories,
} from "../controllers/itemController.js";

const router = Router();

router.route("/items/all").get(getManyItems);
router.route("/items/categories/all").get(getCategories);
router.route("/items/featured/:featured").get(getFeaturedItems);
router.route("/items/:itemId").get(getItem);

// ADMIN ONLY
router.route("/items/new").post(authenticateUser, authorizeAdmin, createItem);
router
  .route("/items/:itemId")
  .patch(authenticateUser, authorizeAdmin, updateItem);
router
  .route("/items/:itemId")
  .delete(authenticateUser, authorizeAdmin, deleteItem);

export default router;
