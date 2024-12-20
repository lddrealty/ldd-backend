const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    phone: {
      type: String,
      required: [true, "phone is required"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
    status: {
      type: String,
      enum: ["pending", "resolved", "archived"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);
contactSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Contact", contactSchema);
