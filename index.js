require("express-async-errors");
const express = require("express");
const app = express();
let http = require("http").createServer(app);
let io = require("socket.io")(http);

require("./middleHandler")(app);
require("./db/mongoConnection")();
require("./validators/socketSetup")(io);
app.get("*", (req, res) => {
  res.send("Error: route not found");
});

http.listen(process.env.PORT || 80, () => {
  console.log("App started at port", process.env.CONNECTION_PORT);
});
