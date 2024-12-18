const Listing = require("../models/listings.model");
const { handleFileUploads } = require("../utils/fileUploader");

class ListingController {
  // Get all listings
  getAllListings = async (req, res) => {
    try {
      const listings = await Listing.find().sort({ createdAt: -1 });
      res.status(200).json(listings);
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
      const dataToSave = JSON.parse(req.body.data);

      // const dataToSave = req.body;
      const { files } = req;

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
      const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedListing) {
        return res.status(404).json({ message: "Listing not found" });
      }
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
      res.status(200).json({ message: "Listing deleted successfully" });
    } catch (error) {
      console.error({ error });
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = new ListingController();
