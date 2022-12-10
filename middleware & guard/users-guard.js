const { users } = require("../models/UsersModel");

module.exports.getProfile = async function (req, res, data, limit) {
  const user = await users
    .findOne({ username: data })
    .populate({
      path: "posts",
      select: "postId postPreviewHolder postDate PreviewHolderType",
      options: { sort: { postDate: -1 }, limit: 9, skip: Number(limit) },
    })
    .select("-__v -password");
  return user;
};

module.exports.PrivateProfile = function (req, res, userProfile) {
  if (
    userProfile.followers.includes(req.user._id) ||
    userProfile._id.equals(req.user._id)
  ) {
    return userProfile;
  } else {
    userProfile["posts"] = userProfile.posts.length;
    return userProfile;
  }
};
