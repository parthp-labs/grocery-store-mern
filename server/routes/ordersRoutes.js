import { Router } from "express";
import {
  deleteOrder,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  newOrder,
  orderSuccess,
  orderFail,
  cancelOrder,
  getAllUserOrders,
  downloadOrderInvoice,
} from "../controllers/ordersController.js";
import {
  authenticateUser,
  authorizeAdmin,
} from "../middlewares/authenticate.js";

const router = Router();

router.route("/orders/user/all").get(authenticateUser, getAllUserOrders);
router.route("/orders/new").post(authenticateUser, newOrder);
router.route("/orders/:orderId").get(authenticateUser, getSingleOrder);
router.route("/orders/:orderId/cancel").patch(authenticateUser, cancelOrder);
router.route("/orders/payment/success").get(authenticateUser, orderSuccess);
router.route("/orders/payment/fail").get(authenticateUser, orderFail);
router
  .route("/orders/:orderId/download")
  .get(authenticateUser, downloadOrderInvoice);

// ADMIN ONLY
router
  .route("/orders/admin/all")
  .get(authenticateUser, authorizeAdmin, getAllOrders);
router
  .route("/orders/:orderId")
  .patch(authenticateUser, authorizeAdmin, updateOrderStatus);
router
  .route("/orders/:orderId")
  .delete(authenticateUser, authorizeAdmin, deleteOrder);

export default router;
