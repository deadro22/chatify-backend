const mongoose = require("mongoose");

const game = new mongoose.Schema({
  game: { type: String, required: true, unique: true },
  genre: {
    type: String,
    required: true,
    enum: [
      "Shooter",
      "Survival",
      "BattleRoyale",
      "Horror",
      "RPG",
      "Simulation",
      "Strategy",
      "Sports",
    ],
  },
  isValid: { type: Boolean, default: false },
  wanted: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
});

const games = mongoose.model("games", game);

module.exports.games = games;
