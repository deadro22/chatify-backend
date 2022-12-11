const mongoose = require("mongoose");

module.exports = function () {
  mongoose.set("strictQuery", false);
  console.log(process.env.DB_CONNECTION_URI);
  mongoose.connect(process.env.DB_CONNECTION_URI, {}, () => {
    console.log("Connected to db");
  });
};
