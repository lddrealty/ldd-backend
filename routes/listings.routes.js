const express = require("express");
const router = express.Router();
const ListingController = require("../controllers/listings.controller");
const upload = require("../middlewares/multer.middleware");
router.get("/", ListingController.getAllListings);
router.get("/:id", ListingController.getListingById);
router.post("/", [upload.array("photos")], ListingController.createListing);
router.put("/:id", [upload.array("photos")], ListingController.updateListing);
router.patch("/:id/archive", ListingController.archiveListing);
router.delete("/:id", ListingController.deleteListing);

module.exports.listingRouter = router;
