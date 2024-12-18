const express = require("express");
const router = express.Router();

const BlogController = require("../controllers/blog.controller");
const { Auth } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware"); // No 'default', just require
router.get("/", BlogController.getAllBlogs);
router.get("/:id", BlogController.getBlogById);

router.post("/", [upload.any("photos")], BlogController.createBlog);

router.put("/:id", [upload.any("photos")], BlogController.updateBlog);

router.delete("/:id", [Auth], BlogController.deleteBlog);

module.exports.BlogRouter = router;
