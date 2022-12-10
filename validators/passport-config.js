const passport = require("passport");
const LocalStrategy = require("passport-local");
const { users } = require("../models/UsersModel");
const { comparePass } = require("../validators/bcryptValid");

module.exports = function () {
  passport.use(
    new LocalStrategy(
      { usernameField: "ident" },
      async (ident, password, done) => {
        const user = await users.findOne({
          $or: [{ username: ident }, { email: ident }],
        });
        if (!user) return done(null, false, { message: "Email Incorrect" });
        const isMatch = await comparePass(password, user.password);
        if (!isMatch)
          return done(null, false, { message: "Password Incorrect" });
        return done(null, { _id: user._id, username: user.username });
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((id, done) => {
    console.log(id);
    users.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
