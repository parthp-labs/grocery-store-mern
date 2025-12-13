import { Router } from "express";
import {
  authenticateUser,
  authorizeAdmin,
} from "../middlewares/authenticate.js";
import {
  createBlog,
  deleteBlog,
  getAllBlogTags,
  getAllBlogs,
  getBlog,
  getRecentBlogs,
  updateBlog,
} from "../controllers/blogsController.js";

const router = Router();

router.route("/blogs/new").post(authenticateUser, authorizeAdmin, createBlog);
router.route("/blogs/all").get(getAllBlogs);
router.route("/blogs/recent").get(getRecentBlogs);
router
  .route("/blogs/:blogId")
  .get(getBlog)
  .patch(authenticateUser, authorizeAdmin, updateBlog)
  .delete(authenticateUser, authorizeAdmin, deleteBlog);
router.route("/blogs/tags/all").get(getAllBlogTags);

export default router;
