const mongoose = require("mongoose");

const comment = new mongoose.Schema({
  commentPost: { type: mongoose.Schema.Types.ObjectId, ref: "posts" },
  comments: [
    {
      commentOwner: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
      commentInner: { type: String },
      commentDate: { type: Date },
    },
  ],
});

const comments = mongoose.model("comments", comment);

module.exports.comments = comments;
