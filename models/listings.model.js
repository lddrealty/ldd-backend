const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    map: {
      type: String,
    },
    listingId: {
      type: String,
    },
    price: {
      type: String,
    },
    bedrooms: {
      type: Number,
    },
    additionalRooms: {
      type: String,
      default: null,
    },
    bathrooms: {
      type: Number,
    },
    area: {
      type: String, // Could be a string to include both value and unit (e.g., "440 Sq.Yd.")
    },
    furnishingStatus: {
      type: String, // Semi-Furnished, Fully Furnished, etc.
    },
    facing: {
      type: String,
      default: null,
    },
    balcony: {
      type: String, // e.g., "Connected" or "Not Connected"
      default: null,
    },
    powerBackup: {
      type: String, // e.g., "Available" or "Not Available"
      default: null,
    },
    flooring: {
      type: String, // e.g., "Marble", "Tiles", etc.
      default: null,
    },
    floorNumber: {
      type: Number,
      default: null,
    },
    totalFloors: {
      type: Number,
      default: null,
    },
    unitNumber: {
      type: Number,
      default: null,
    },
    view: {
      type: String, // e.g., "Park View"
      default: null,
    },
    highlights: {
      tags: [String], // Array of strings like ["Schools in vicinity", "Breakthrough Price"]
      description: {
        type: String,
        default: null,
      },
      points: [String], // Array for detailed highlight points
    },
    media: {
      type: [String],
      default: [],
    },
    location: {
      city: {
        type: String,
      },
      locality: {
        type: String,
      },
      microMarket: {
        type: String,
        default: null,
      },
    },
    propertyDetails: {
      listingType: {
        type: String, // e.g., "Sale", "Rent"
      },
      buildingType: {
        type: String, // e.g., "Residential", "Commercial"
      },
      propertyType: {
        type: String, // e.g., "Builder Floor"
      },
    },
    contactOptions: {
      whatsapp: {
        type: Boolean,
        default: true,
      },
      requestCall: {
        type: Boolean,
        default: true,
      },
    },
    reportLink: {
      type: String, // Link to report issues with the listing
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Listing", listingSchema);
