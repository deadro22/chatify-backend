const express = require("express");
const router = express.Router();
const path = require("path");
const { isloggedIn } = require("../middleware & guard/auth-guard");
const { users } = require("../models/UsersModel");
const { posts, genPostId } = require("../models/PostModel");
const {
  viewPostAuth,
  isPostOwner,
  createPost,
} = require("../middleware & guard/posts-guard");
const { uploadSetup } = require("../middleware & guard/file-guard");
const cloudinary = require("cloudinary").v2;
const { comments } = require("../models/CommentsModel");
const crypto = require("crypto");

router.use(isloggedIn);

const { duri, upload } = uploadSetup();

router.get("/rev/:postId", async (req, res) => {
  const post = await posts
    .findOne({ postId: req.params.postId })
    .populate("postOwner", "username followers private profileImage")
    .populate({
      path: "postComments",
      populate: {
        path: "comments.commentOwner",
        model: "users",
        select: "username profileImage -_id",
      },
    });
  const user = await users
    .findOne({ _id: req.user._id })
    .select("username profileImage");
  if (!post) return res.status(404).send("Post not found");
  if (!viewPostAuth(post, req.user))
    return res.status(403).send("You can't view this post");
  res.json({ post, user });
});

router.get("/rev/:post_id/:postId/comments", async (req, res) => {
  const post = await posts
    .findOne({ postId: req.params.postId })
    .populate("postOwner", "followers private");
  const s_comments = await comments
    .findOne({
      commentPost: req.params.post_id,
    })
    .populate("comments.commentOwner", "username profileImage ");
  if (!s_comments) return res.status(404).send("Comments not found");
  if (!viewPostAuth(post, req.user))
    return res.status(403).send("You can't view this post");
  res.send(s_comments);
});

router.post(
  "/post/:username/new",
  upload.single("post_prev"),
  async (req, res) => {
    const user = await users.findOne({ username: req.params.username });
    if (!user) return res.status(404).send("Invalid user");
    if (!req.body.postHeader)
      return res.status(422).send("Post header required");
    if (!isPostOwner(user, req))
      return res.status(403).send("unauthorized: not your profile");
    if (!req.file) return res.status(422).send("Image or video required");
    duri.format(
      path.extname(req.file.originalname).toString(),
      req.file.buffer
    );
    const file_buff = crypto.randomBytes(16).toString("hex");
    const publicIdFl =
      req.file.mimetype === "video/mp4" ? "videos/uploads/" : "images/uploads/";
    console.log(publicIdFl);
    cloudinary.uploader.upload(
      duri.content,
      {
        public_id: publicIdFl + file_buff + new Date().getTime(),
        quality: 80,
        resource_type: "raw",
      },
      async (err, ress) => {
        try {
          if (err) throw err;
          console.log(ress);
          const newPost = await createPost(
            genPostId(),
            user._id,
            req.body.postHeader,
            new Date(),
            ress.secure_url,
            req.body.src_type
          );
          const comment = new comments({
            commentPost: newPost._id,
          });
          user.posts.push(newPost._id);
          await comment.save();
          if (err) return new Error("Failed to load your image");
          newPost.postComments.push(comment._id);
          await newPost.save();
          await user.save();
          res.send(newPost);
        } catch (e) {
          console.log(e);
          return new Error("Something went wrong");
        }
      }
    );
  }
);

module.exports = router;
