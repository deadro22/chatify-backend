const mongoose = require("mongoose");

module.exports = function () {
  mongoose.set("strictQuery", false);
  console.log(process.env.DB_CONNECTION_URI);
  mongoose.connect(
    process.env.DB_CONNECTION_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
    () => {
      console.log("Connected to db");
    }
  );
};
