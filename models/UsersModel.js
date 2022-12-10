const mongoose = require("mongoose");

const user = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 150,
  },
  password: { type: String, required: true, minlength: 10 },
  private: { type: Boolean, required: true, default: false },
  profileImage: { type: String, default: "" },
  profileDescription: { type: String },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  followRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  reputation: {
    upVotes: { type: Number, default: 0 },
    downVotes: { type: Number, default: 0 },
  },
  favGames: [
    {
      type: String,
    },
  ],
  otherGames: [
    {
      type: String,
    },
  ],
  prfLanguage: { type: String },
  isLookingForPlayers: { type: Boolean, default: false },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "posts" }],
});

const users = mongoose.model("users", user);

module.exports.users = users;
