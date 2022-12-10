const { posts } = require("../models/PostModel");
const { images } = require("../models/FileModel");

module.exports.viewPostAuth = function (post, user) {
  if (
    !(
      post.postOwner._id.equals(user._id) ||
      post.postOwner.followers.includes(user._id) ||
      !post.postOwner.private
    )
  ) {
    return false;
  } else {
    return true;
  }
};
module.exports.isPostOwner = function (postOwner, req) {
  if (!postOwner._id.equals(req.user._id)) {
    return false;
  } else {
    return true;
  }
};
module.exports.createPost = async function (
  postId,
  postOwner,
  postHeader,
  postDate,
  postPrevImage,
  PreviewHolderType
) {
  const newPost = new posts({
    postId: postId,
    postOwner: postOwner,
    postHeader: postHeader,
    postDate: postDate,
    postPreviewHolder: postPrevImage,
    PreviewHolderType: PreviewHolderType,
  });

  await newPost.save();
  return newPost;
};
