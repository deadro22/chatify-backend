const passport = require("passport");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const sharedsession = require("express-socket.io-session");

module.exports = function (app) {
  app.use(
    session({
      store: new MongoDBStore({
        uri: process.env.DB_CONNECTION_URI,
        collection: "cnt_sess",
      }),
      name: process.env.SESS_NID,
      secret: process.env.SESS_SRC,
      resave: true,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 24 * 60 * 60 * 365,
        httpOnly: true,
        //secure: true,
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
};
