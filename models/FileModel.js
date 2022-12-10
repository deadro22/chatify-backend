const mongoose = require("mongoose");

const image = new mongoose.Schema({
  topicCategory: {
    type: String,
    required: true,
    enum: ["profile-image", "post-image", "site-image"],
  },
  holderId: { type: mongoose.Schema.Types.ObjectId },
  imageNID: { type: String, required: true, unique: true },
  imageContent: { type: String, required: true },
});

const images = mongoose.model("images", image);

module.exports.images = images;
