const Banner = require("../models/banner.model");
const handleFileRemovalAndUploads = require("../utils/deleteCloudinaryImage");
const { handleFileUploads } = require("../utils/fileUploader");

class BannerController {
  getAllBanners = async (req, res) => {
    try {
      const data = await Banner.find();

      return res.status(200).json({
        message: "All Banners Fetched successful",
        data: data,
      });
    } catch (error) {
      console.log({ error });
      res.status(500).json({ error: error.message });
    }
  };
  createBanner = async (req, res) => {
    try {
      const dataToSave = req.body;

      console.log(dataToSave);

      const files = req.files;
      if (files && files.length > 0) {
        await handleFileUploads(files, "none", "media", dataToSave, true);
      }
      const banner = new Banner(dataToSave);
      await banner.save();
      res.status(201).json(banner);
    } catch (error) {
      console.log({ error });
      res.status(500).json({ error: error.message });
    }
  };

  updateBanner = async (req, res) => {
    try {
      const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!banner) {
        return res.status(404).json({ message: "Banner not found" });
      }
      const files = req.files;
      if (req.body.imagesToRemove) {
        await handleFileRemovalAndUploads(banner, {
          filesToRemove: req.body.imagesToRemove,
          arrayTargetKeys: ["media"],
        });
      }
      if (files && files.length > 0) {
        await handleFileUploads(files, "none", "media", banner, true);
      }

      await banner.save();

      res.status(200).json(banner);
    } catch (error) {
      console.log({ error });
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = new BannerController();
