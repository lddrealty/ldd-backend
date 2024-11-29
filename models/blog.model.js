const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    thumbnail: String,
    title: {
      type: String,
      required: true,
    },
    content: {
      type: [String],
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    deactivated: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

blogSchema.pre(["find", "findOne", "findById"], function () {
  const { getAll = false } = this.options;

  if (!getAll) {
    this.where({ deactivated: false });
  }
});
blogSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Blog", blogSchema);
