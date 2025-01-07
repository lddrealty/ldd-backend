const express = require("express");
const router = express.Router();
const ListingController = require("../controllers/listings.controller");
const {upload} = require("../utils/fileUploader");
const { Auth } = require("../middlewares/auth.middleware");
router.get("/", ListingController.getAllListings);
router.get("/:id", ListingController.getListingById);
router.post(
  "/",
  [upload.array("photos"), Auth],
  ListingController.createListing
);
router.put(
  "/:id",
  [upload.array("photos"), Auth],
  ListingController.updateListing
);
router.patch("/:id/archive", [Auth], ListingController.archiveListing);
router.delete("/:id", [Auth], ListingController.deleteListing);

module.exports.listingRouter = router;
