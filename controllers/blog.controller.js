const Blog = require("../models/blog.model");

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
      const dataToSave = req.body;
      const files = req.files;
      if (files && files.length > 0) {
        await handleFileUploads(files, "none", "media", dataToSave);
      }
      const blog = new Blog(dataToSave);
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
      if (files && files.length > 0) {
        await handleFileUploads(files, "none", "media", blog);
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
