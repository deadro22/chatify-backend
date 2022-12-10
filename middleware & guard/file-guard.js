const { images } = require("../models/FileModel");
const multer = require("multer");
const Datauri = require("datauri");

module.exports.createImage = async function (
  topicCategory,
  holderId,
  imageNID,
  imageName,
  imageType,
  imageContent
) {
  const p_image = new images({
    topicCategory: topicCategory,
    holderId: holderId,
    imageNID: "img_p_" + imageNID,
    imageName: imageName,
    imageType: imageType,
    imageContent: imageContent,
  });

  await p_image.save();
  return p_image;
};

module.exports.uploadSetup = () => {
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 50000000,
      files: 1,
      fieldSize: 1024 * 1024 * 50,
    },
  });
  const duri = new Datauri();
  return { duri, upload };
};
