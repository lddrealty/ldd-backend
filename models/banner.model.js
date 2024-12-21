const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const bannerSchema = new mongoose.Schema(
  {
    media: [String],
    about: [String],
    listing: String,
    deactivated: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

bannerSchema.plugin(mongoosePaginate);

bannerSchema.pre(["find", "findOne", "findById"], function () {
  const { getAll = false } = this.options;

  if (!getAll) {
    this.where({ deactivated: false });
  }
});
bannerSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Banner", bannerSchema);
