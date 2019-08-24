const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const morgan = require("morgan");

const path = require("path");
const PORT = 4000;

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "/client/build")));

app.get("/", (req, res, next) => {
  res.sendFile(__dirname + "/client/build/index.html");
});

server.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});

io.on("connection", socket => {
  console.log("사용자 연결됨");

  io.emit("message", "낯선 사람이 입장했습니다.");

  socket.on("submit message", msg => {
    console.log(`message: ${msg}`);

    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("사용자 연결 끊김.");

    io.emit("message", "낯선 사람이 퇴장했습니다");
  });
});
