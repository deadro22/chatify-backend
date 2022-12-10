const { likePost, commentPost } = require("../Routes/PostInterHandler");

module.exports = function (io) {
  io.of("/post").on("connection", (socket) => {
    socket.on("joinPost", (room) => {
      socket.join(room);
      socket.on("likePost", async (data) => {
        const lk_res = await likePost(data);
        if (lk_res) {
          io.of("/post").in(room).emit("likeRes", { like: true });
          socket.emit("likeStyleRes", { like: true });
        } else {
          io.of("/post").in(room).emit("likeRes", { like: false });
          socket.emit("likeStyleRes", { like: false });
        }
      });
      socket.on("commentPost", async (data) => {
        const cm_res = await commentPost(data);
        if (cm_res) {
          io.of("/post").in(room).emit("commentPostRes", { cm_res });
        }
      });
    });
  });
  io.of("/streams/stream").on("connection", (socket) => {
    socket.on("test", (stream) => {
      io.of("/streams/stream").emit("testRes", stream);
    });
  });
};
