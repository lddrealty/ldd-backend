const Listing = require("../models/listings.model");
const createFilter = require("../utils/createFilter");
const handleFileRemovalAndUploads = require("../utils/deleteCloudinaryImage");
const { handleFileUploads } = require("../utils/fileUploader");

function generateListingId() {
  const prefix = "LST";
  const uniqueNumber = Math.floor(Math.random() * 100000); // Random number from 0 to 99999
  return prefix + uniqueNumber.toString().padStart(5, "0"); // Ensure 5 digits with leading zeros
}

class ListingController {
  // Get all listings
  getAllListings = async (req, res) => {
    try {
      const { options } = createFilter(req.query);

      const data = await Listing.paginate({}, options);

      return res.status(200).json({
        message: "All Listings Fetched successful",
        data: data.docs,
        totalDocs: data.totalDocs,
        totalPages: data.totalPages,
        currentPage: data.page,
        hasNextPage: data.hasNextPage,
        hasPrevPage: data.hasPrevPage,
      });
    } catch (error) {
      console.error({ error });
      res.status(500).json({ error: error.message });
    }
  };

  // Get listing by ID
  getListingById = async (req, res) => {
    try {
      const listing = await Listing.findById(req.params.id);
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      res.status(200).json(listing);
    } catch (error) {
      console.error({ error });
      res.status(500).json({ error: error.message });
    }
  };

  // Create a new listing
  createListing = async (req, res) => {
    try {
      const dataToSave = req.body;
      const { files } = req;

      dataToSave.listingId = generateListingId();

      if (files && files.length > 0) {
        await handleFileUploads(files, "none", "media", dataToSave, true);
      }

      const newListing = new Listing(dataToSave);
      await newListing.save();
      res
        .status(201)
        .json({ message: "Listing Created Successfully", data: newListing });
    } catch (error) {
      console.error({ error });
      res.status(500).json({ error: error.message });
    }
  };

  // Update listing by ID
  updateListing = async (req, res) => {
    try {
      const dataToSave = req.body;
      const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedListing) {
        return res.status(404).json({ message: "Listing not found" });
      }

      if (dataToSave.imagesToRemove && dataToSave.imagesToRemove !== null) {
        await handleFileRemovalAndUploads(updatedListing, {
          filesToRemove: dataToSave.imagesToRemove,
          arrayTargetKeys: ["media"],
        });
      }
      const files = req.files;
      if (files && files.length > 0) {
        await handleFileUploads(files, "none", "media", updatedListing, true);
      }

      await updatedListing.save();
      res.status(200).json(updatedListing);
    } catch (error) {
      console.error({ error });
      res.status(500).json({ error: error.message });
    }
  };

  // Archive (soft delete) a listing by ID
  archiveListing = async (req, res) => {
    try {
      const archivedListing = await Listing.findByIdAndUpdate(req.params.id, {
        archived: true,
      });
      if (!archivedListing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      res.status(200).json({ message: "Listing archived successfully" });
    } catch (error) {
      console.error({ error });
      res.status(500).json({ error: error.message });
    }
  };

  // Delete listing permanently
  deleteListing = async (req, res) => {
    try {
      const deletedListing = await Listing.findByIdAndDelete(req.params.id);
      if (!deletedListing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      if (deletedListing.media && deletedListing.media !== null) {
        await handleFileRemovalAndUploads(deletedListing, {
          filesToRemove: deletedListing.media,
        });
      }
      res.status(200).json({ message: "Listing deleted successfully" });
    } catch (error) {
      console.error({ error });
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = new ListingController();
