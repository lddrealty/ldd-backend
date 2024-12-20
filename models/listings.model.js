const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const listingSchema = new mongoose.Schema(
  {
    title: String,
    map: String,
    listingId: String,
    price: String,
    bedrooms: Number,
    additionalRooms: {
      type: String,
      default: null,
    },
    bathrooms: Number,
    area: String,
    furnishingStatus: String,
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
      city: String,
      locality: String,
      microMarket: {
        type: String,
        default: null,
      },
    },
    propertyDetails: {
      listingType: String,
      buildingType: String,
      propertyType: String,
    },
    contactOptions: {
      whatsapp: String,
      phone: String,
    },
  },
  {
    timestamps: true,
  }
);
listingSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Listing", listingSchema);
