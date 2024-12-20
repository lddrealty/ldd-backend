const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const blogSchema = new mongoose.Schema(
  {
    media: String,
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

blogSchema.plugin(mongoosePaginate);


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
