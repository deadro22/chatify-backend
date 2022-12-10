const express = require("express");
const router = express.Router();
const { isloggedIn } = require("../middleware & guard/auth-guard");
const { posts } = require("../models/PostModel");
const { viewPostAuth } = require("../middleware & guard/posts-guard");
const { comments } = require("../models/CommentsModel");
const { users } = require("../models/UsersModel");

router.use(isloggedIn);

module.exports.likePost = async (data) => {
  const user = await users.findOne({ _id: data.userId }).select("username");
  const post = await posts
    .findOne({ postId: data.postId })
    .populate("postOwner", "username followers private");
  if (!post) return console.error("Post not found");
  if (!viewPostAuth(post, user)) return console.error("Not authorized");
  if (post.likes.includes(user._id)) {
    await posts.updateOne(
      { postId: data.postId },
      { $inc: { postLikes: -1 }, $pull: { likes: user._id } }
    );
    return false;
  } else {
    post.postLikes += 1;
    post.likes.push(user._id);
    await post.save();
    return true;
  }
};

module.exports.commentPost = async function (data) {
  const user = await users
    .findOne({ _id: data.userId })
    .select("username profileImage");
  const post = await posts
    .findOne({ postId: data.postId })
    .populate("postOwner", "username followers private")
    .populate("postComments.commentOwner", "username");
  if (!post) return console.error("Post not found");
  const comment = await comments.findOne({ commentPost: post._id });
  if (!viewPostAuth(post, user)) return console.error("Unauthorized");
  if (!data.commentBody) return console.error("Comment body is required");
  const newComment = {
    commentOwner: data.userId,
    commentInner: data.commentBody,
    commentDate: new Date(),
  };
  comment.comments.push(newComment);
  await comment.save();
  return { newComment, user };
};
