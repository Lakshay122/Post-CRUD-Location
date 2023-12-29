const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  body: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  location: {
    type: { type: String, required: true },
    coordinates: [],
  },
});

postSchema.index({ location: "2dsphere" });
module.exports = mongoose.model("Post", postSchema);
