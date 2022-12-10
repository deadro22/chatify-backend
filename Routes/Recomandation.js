const express = require("express");
const router = express.Router();
const { isloggedIn } = require("../middleware & guard/auth-guard");
const { users } = require("../models/UsersModel");
const { games } = require("../models/GamesModel");

router.use(isloggedIn);

router.get("/games", async (req, res) => {
  const games = await games.find({
    game: { $regex: req.query.gm_n, $options: "i" },
  });
  if (!games) return res.status(404).send("No games found");
  res.send(games);
});

router.get("/profiles/searching", async (req, res) => {
  if (!req.query.sr_gm) return res.status(404).send("Invalid game");
  const searchActiveUsers = await users
    .find({
      $and: [
        {
          $or: [{ favGames: req.query.sr_gm }, { otherGames: req.query.sr_gm }],
        },
        { isLookingForPlayers: true },
      ],
    })
    .select("username profileImage");
  const searchOnlineUsers = await users
    .find({
      $and: [
        {
          $or: [{ favGames: req.query.sr_gm }, { otherGames: req.query.sr_gm }],
        },
        { isLookingForPlayers: false },
      ],
    })
    .select("username profileImage");
  res.json({ searchActiveUsers, searchOnlineUsers });
});

router.post("/fvgm/update", async (req, res) => {
  if (!req.body.favGames) return res.status(422).send("Invalid games");
  const gamesList = req.body.favGames.replace(/ {1,}/g, " ").trim().split("/");
  if (gamesList.length > 3) return res.status(422).send("Games must be 3");
  const user = await users.findOne({ _id: req.user._id }).select("favGames");
  for (let i = 0; i < gamesList.length; i++) {
    user.favGames[i] = gamesList[i];
    await games.findOneAndUpdate(
      { game: { $regex: gamesList[i], $options: "i" } },
      { $set: { game: gamesList[i] }, $addToSet: { wanted: req.user._id } },
      { new: true, upsert: true }
    );
  }
  user.markModified("favGames");
  await user.save();
  res.send(user.favGames);
});

router.post("/otgm/update", async (req, res) => {
  if (!req.body.otherGames) return res.status(422).send("Invalid games");
  const gamesList = req.body.otherGames
    .replace(/ {1,}/g, " ")
    .trim()
    .split("/");
  for (let i = 0; i < gamesList.length; i++) {
    await games.findOneAndUpdate(
      { game: { $regex: gamesList[i], $options: "i" } },
      { $set: { game: gamesList[i] }, $addToSet: { wanted: req.user._id } },
      { new: true, upsert: true }
    );
  }
  const upUser = await users.findOneAndUpdate(
    { _id: req.user._id },
    { $addToSet: { otherGames: gamesList } },
    { new: true }
  );
  res.send(upUser.otherGames);
});

module.exports = router;
