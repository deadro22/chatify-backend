const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get("/stream/:streamId", (req, res) => {
  res.header("Content-Type", "video/mp4");
  const data = fs.createReadStream(__dirname + "/dog.mp4");
  data.pipe(res);
});

module.exports = router;
