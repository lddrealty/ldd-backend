const Blog = require("../models/blog.model");
const imgbbUploader = require("imgbb-uploader");
const { IMGBB_API } = process.env;

class BlogController {
  getAllBlogs = async (req, res) => {
    try {
      const blogs = await Blog.find().sort({ createdAt: -1 });
      res.status(200).json(blogs);
    } catch (error) {
      console.log({ error });
      res.status(500).json({ error: error.message });
    }
  };

  getBlogById = async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      res.status(200).json(blog);
    } catch (error) {
      console.log({ error });
      res.status(500).json({ error: error.message });
    }
  };

  createBlog = async (req, res) => {
    try {
      const { title, content, author } = req.body;
      const files = req.files;
      let thumbnail;
      if (files && files.length > 0) {
        try {
          const response = await imgbbUploader(IMGBB_API, files[0].path);
          thumbnail = response.image.url;
        } catch (error) {
          console.error(error);
          return res
            .status(500)
            .json({ error: "Error uploading image to imgbb" });
        }
      }
      const blog = new Blog({ title, content, author, thumbnail });
      await blog.save();
      res.status(201).json(blog);
    } catch (error) {
      console.log({ error });
      res.status(500).json({ error: error.message });
    }
  };

  updateBlog = async (req, res) => {
    try {
      const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      const files = req.files;
      let thumbnail;
      if (files && files.length > 0) {
        try {
          const response = await imgbbUploader(IMGBB_API, files[0].path);
          thumbnail = response.image.url;
        } catch (error) {
          console.error(error);
          return res
            .status(500)
            .json({ error: "Error uploading image to imgbb" });
        }
      }

      if (thumbnail) {
        blog.thumbnail = thumbnail;
      }

      await blog.save();

      res.status(200).json(blog);
    } catch (error) {
      console.log({ error });
      res.status(500).json({ error: error.message });
    }
  };

  deleteBlog = async (req, res) => {
    try {
      const blog = await Blog.findByIdAndUpdate(req.params.id, {
        deactivated: true,
      });
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
      console.log({ error });
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = new BlogController();
