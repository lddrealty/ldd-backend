const express = require("express");
const router = express.Router();

const BlogController = require("../controllers/blog.controller");
const { Auth } = require("../middlewares/auth.middleware");
const {upload} = require("../utils/fileUploader"); // No 'default', just require
router.get("/", BlogController.getAllBlogs);
router.get("/:id", BlogController.getBlogById);

router.post("/", [upload.any("photos"), Auth], BlogController.createBlog);

router.put("/:id", [upload.any("photos"), Auth], BlogController.updateBlog);

router.delete("/:id", [Auth], BlogController.deleteBlog);

module.exports.BlogRouter = router;
