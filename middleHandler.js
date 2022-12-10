const express = require("express");
const api_All = require("./Routes/ApiRouteHandler");
const dotenv = require("dotenv");
const error = require("./errors/errorHandler");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

module.exports = function (app) {
  dotenv.config();
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
  app.use(express.json());
  cloudinary.config({
    cloud_name: "dinvcqnor",
    api_key: "831558239499589",
    api_secret: "hJ64bJrdL42kwpIeNtqjiHX9Nmg",
  });
  app.use(error);
  require("./sessions_handler_stp")(app);
  require("./validators/passport-config")();
  api_All("/api", app);
};
