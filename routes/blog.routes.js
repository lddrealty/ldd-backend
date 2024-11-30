const express = require("express");
const router = express.Router();

const BlogController = require("../controllers/blog.controller");
const { Auth } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware"); // No 'default', just require
const parseRequestBodyMiddleware = (req, res, next) => {
  if (req.body.data) {
    try {
      req.body = JSON.parse(req.body.data);
    } catch (parseError) {
      console.log({ parseError });
      return res.status(400).json({ error: "Invalid JSON in request body" });
    }
  }
  next(); // Proceed to the next middleware or route handler
};
router.get("/", BlogController.getAllBlogs);
router.get("/:id", BlogController.getBlogById);

router.post(
  "/",
  [upload.any(), parseRequestBodyMiddleware],
  BlogController.createBlog
);

router.put("/:id", [Auth], BlogController.updateBlog);

router.delete("/:id", [Auth], BlogController.deleteBlog);

module.exports.BlogRouter = router;
