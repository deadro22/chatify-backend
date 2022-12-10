const users = require("./UsersAuthRoute");
const usersInter = require("./UserInterRoute");
const posts = require("./PostsHandlerRoute");
const streaming = require("./StreamingHandler");
const recom = require("./Recomandation");

module.exports = function (ln, app) {
  app.use(ln + "/users/", users);
  app.use(ln + "/users/", usersInter);
  app.use(ln + "/posts/", posts);
  //app.use(ln + "/upld/imgs", imageHandler);
  app.use(ln + "/streaming/", streaming);
  app.use(ln + "/recom/", recom);
};
