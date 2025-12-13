import { Router } from "express";
import {
  authenticateUser,
  authorizeAdmin,
} from "../middlewares/authenticate.js";
import {
  deleteUserById,
  getAllUsers,
  makeUserAdmin,
} from "../controllers/adminController.js";
import { getDashboardStats } from "../controllers/dashboardController.js";

const router = Router();

router.route("/users/").get(authenticateUser, authorizeAdmin, getAllUsers);
router
  .route("/users/:userId")
  .delete(authenticateUser, authorizeAdmin, deleteUserById);
router
  .route("/users/:userId/makeAdmin")
  .patch(authenticateUser, authorizeAdmin, makeUserAdmin);
router
  .route("/dashboard/stats")
  .get(authenticateUser, authorizeAdmin, getDashboardStats);

export default router;
