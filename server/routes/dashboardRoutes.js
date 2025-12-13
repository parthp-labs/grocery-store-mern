import { Router } from "express";
import { authenticateUser, authorizeAdmin } from "../middlewares/authenticate";

const router = Router();

router.route("stats")

export default router;
