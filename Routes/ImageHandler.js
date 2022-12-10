const express = require("express");
const router = express.Router();
const { images } = require("../models/FileModel");

router.get("/image/preview/:imgTPC/:imageName", async (req, res) => {
  const image = await images.findOne({
    imageNID: req.params.imageName,
    topicCategory: req.params.imgTPC,
  });
  if (!image) return res.status(404).send("Image not found");
  res.setHeader("Content-type", image.imageType);
  res.send(image.imageContent);
});

module.exports = router;
