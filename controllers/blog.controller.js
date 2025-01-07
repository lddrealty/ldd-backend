const Blog = require("../models/blog.model");
const createFilter = require("../utils/createFilter");
const handleFileRemovalAndUploads = require("../utils/deleteCloudinaryImage");
const { handleFileUploads } = require("../utils/fileUploader");

class BlogController {
  getAllBlogs = async (req, res) => {
    try {
      const { options } = createFilter(req.query);

      const data = await Blog.paginate({}, options);

      return res.status(200).json({
        message: "All Blogs Fetched successful",
        data: data.docs,
        totalDocs: data.totalDocs,
        totalPages: data.totalPages,
        currentPage: data.page,
        hasNextPage: data.hasNextPage,
        hasPrevPage: data.hasPrevPage,
      });
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

      console.log(dataToSave);

      const {files} = req;
    console.log({files})
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
      const dataToSave = req.body;
      const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      console.log(blog.media);

      const files = req.files;
      if (files && files.length > 0) {
        await handleFileRemovalAndUploads(blog, {
          filesToRemove: blog.media,
          stringTargetKeys: ["media"],
        });
        await handleFileUploads(files, "none", "media", blog);
      }

      console.log(blog.media);

      await blog.save();

      res.status(200).json(blog);
    } catch (error) {
      console.log({ error });
      res.status(500).json({ error: error.message });
    }
  };

  deleteBlog = async (req, res) => {
    try {
      const blog = await Blog.findByIdAndDelete(req.params.id);

      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      if (blog.media && blog.media !== null) {
        await handleFileRemovalAndUploads(blog, {
          filesToRemove: blog.media,
        });
      }

      res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
      console.log({ error });
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = new BlogController();
