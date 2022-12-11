const express = require("express");
const router = express.Router();
const { users } = require("../models/UsersModel");
const { createImage } = require("../middleware & guard/file-guard");
const {
  validateLogin,
  validateRegister,
} = require("../validators/userValidator");
const { hashPass } = require("../validators/bcryptValid");
const passport = require("passport");
const { isloggedOut } = require("../middleware & guard/auth-guard");
const multer = require("multer");

router.get("/auth/check", (req, res) => {
  console.log(req.user);
  if (!req.isAuthenticated())
    return res.status(403).send("You must login to view this content");
  const user = {
    _id: req.user._id,
    username: req.user.username,
    following: req.user.following,
    followers: req.user.followers,
    posts: req.user.posts,
  };
  res.json(user);
});

router.post("/login", isloggedOut, (req, res, next) => {
  console.log(req.body);
  const { error } = validateLogin(req.body);
  if (error) return res.status(422).send(error.details[0].message);
  passport.authenticate("local", (err, user) => {
    console.log("User is: ", user);
    if (!user) return res.status(404).send("Wrong email or password");
    req.session.regenerate(() => {
      req.login(user, async (err) => {
        console.log("Regenarating .... ", err);
        res.cookie("CNT_ID", "idk");
        res.send(user);
      });
    });
  })(req, res, next);
});

const upload = multer({
  limits: {
    fieldSize: 1024 * 1024 * 2,
  },
});

router.post("/register", isloggedOut, async (req, res) => {
  const { error } = validateRegister(req.body);
  if (error) return res.status(422).send(error.details[0].message);
  const user = await users.findOne({
    $or: [{ username: req.body.username }, { email: req.body.email }],
  });
  if (user) return res.status(403).send("User already exists");
  const hash = await hashPass(req.body.password);
  const n_user = new users({
    username: req.body.username,
    email: req.body.email,
    password: hash,
  });
  await n_user.save();
  req.login(n_user, async (err) => {
    res.send(n_user);
  });
});

router.post(
  "/prf/:username/prf-img/change",
  upload.single("prf-image"),
  async (req, res) => {
    if (!req.file) return res.status(422).send("Invalid image");
    const user = await users.findOne({ username: req.params.username });
    if (!user) return res.status(404).send("User not found");
    if (!user._id.equals(req.user._id))
      return res.status(403).send("Unauthorized");
    const currTimeImageName = new Date().getTime().toString();
    const prf_image = await createImage(
      "profile-image",
      user._id,
      currTimeImageName,
      req.file.originalname,
      req.file.mimetype,
      req.file.buffer
    );
    user.profileImage = prf_image.imageNID;
    await user.save();
    res.send("Profile image changed");
  }
);

router.post("/logout", (req, res, next) => {
  req.logOut();
  req.session.destroy();
  res.send("Logged out");
});

module.exports = router;
