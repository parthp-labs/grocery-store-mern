import express, { Router } from "express";
import { makePayment } from "../controllers/paymentController.js";
import { authenticateUser } from "../middlewares/authenticate.js";

const router = Router();

// Make Payment and Place Order
router.route("/payment/create").post(authenticateUser, makePayment);

export default router;
