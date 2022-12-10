const mongoose = require("mongoose");

function genPostId() {
  return Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000;
}

const post = new mongoose.Schema({
  postOwner: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  postDate: { type: Date, required: true },
  postId: { type: String, required: true, unique: true },
  postHeader: { type: String },
  postPreviewHolder: { type: String },
  PreviewHolderType: { type: String, required: true },
  postLikes: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  postComments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comments" }],
});

const posts = mongoose.model("posts", post);

module.exports.posts = posts;
module.exports.genPostId = genPostId;
