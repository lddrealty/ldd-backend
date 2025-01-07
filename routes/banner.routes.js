const express = require("express");
const router = express.Router();

const BannerController = require("../controllers/banner.controller");
const { Auth } = require("../middlewares/auth.middleware");
const {upload} = require("../utils/fileUploader"); // No 'default', just require
router.get("/", BannerController.getAllBanners);
router.post("/", [upload.any("photos"), Auth], BannerController.createBanner);

router.put("/:id", [upload.any("photos"), Auth], BannerController.updateBanner);

module.exports.BannerRouter = router;
