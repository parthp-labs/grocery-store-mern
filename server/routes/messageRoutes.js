import Router from "express";
import {
  createMessage,
  getAllMessages,
  replyMessage,
} from "../controllers/messageController.js";
import {
  authenticateUser,
  authorizeAdmin,
} from "../middlewares/authenticate.js";

const router = Router();

router.route("/messages/new").post(createMessage);
router
  .route("/messages/all")
  .get(authenticateUser, authorizeAdmin, getAllMessages);
router
  .route("/messages/reply")
  .put(authenticateUser, authorizeAdmin, replyMessage);

export default router;
