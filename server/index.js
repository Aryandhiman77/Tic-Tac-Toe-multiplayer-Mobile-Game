const express = require("express");
const http = require("http");
const cors = require("cors");
const Router = require("../server/src/routes");
const SocketMiddleware = require("./src/middlewares/Socket.Middleware");
const User = require("./src/db/modals/User.Model");
const path = require("path");
const connectDb = require("./src/db/connection");
const GlobalErrorHandler = require("./src/middlewares/GlobalErrorHandler");
const app = express();
app.use(express.static(__dirname + path.join("/public/uploads"))); // to serve static files
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(express.json());
app.use("/api/", Router);
app.use(GlobalErrorHandler);

// console.log(process.env.JWT_SECRET);
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*", // Update with your client origin if needed
    methods: ["GET", "POST"],
  },
});
io.use(SocketMiddleware);

const rooms = {}; // Format: { roomId: { players: [], chat: [], tossDone: false } }
const playerRoomMap = {}; // Format: { socketId: roomId }
const playerSocketMap = {};

io.on("connection", (socket) => {
  console.log(socket.username, " connected with socket id :", socket.id);
  socket.broadcast.emit("checkOnlineUser", { userid: socket.gameid });
  playerSocketMap[socket.gameid] = socket.id;

  console.log("Players active on server", playerSocketMap);

  socket.on("challengeFriend", (friendgameid) => {
    const roomId = socket.gameid;
    rooms[roomId] = { players: [socket.id], chat: [], tossDone: false };
    playerRoomMap[socket.id] = roomId;
    socket.join(roomId);
    const friendSocket = playerSocketMap[friendgameid];
    io.to(friendSocket).emit("liveRoomRequests", {
      roomId,
      friend: {
        id: socket.gameid,
        username: socket.username,
        profile: socket.profile,
      },
    });
  });

  socket.on("createRoom", (callback) => {
    const roomId = Math.random().toString(36).substr(2, 6).toUpperCase();
    rooms[roomId] = { players: [socket.id], chat: [], tossDone: false };
    playerRoomMap[socket.id] = roomId;
    socket.join(roomId);
    callback(roomId);
  });

  socket.on("joinRoom", (roomId, callback) => {
    const room = rooms[roomId];
    if (room && room.players.length === 1) {
      room.players.push(socket.id);
      playerRoomMap[socket.id] = roomId;
      socket.join(roomId);
      socket.roomId = roomId;

      const hostSocketId = room.players[0]; // the one who created the room
      const hostSocket = io.sockets.sockets.get(hostSocketId);

      // Emit to both players
      io.to(roomId).emit("playerJoined", {
        host: {
          username: hostSocket?.username,
          profile: hostSocket?.profile,
          gameid: hostSocket?.gameid,
        },
        joined: {
          username: socket.username,
          profile: socket.profile,
          gameid: socket.gameid,
        },
      });

      callback({ success: true });
    } else {
      callback({ success: false, message: "Room full or not found" });
    }
  });

  socket.on("sendMessage", ({ roomId, message }) => {
    io.to(roomId).emit("receiveMessage", message);
  });

  socket.on("toss", (roomId) => {
    const room = rooms[roomId];

    if (!room || room.players.length !== 2) return;

    const randomIndex = Math.floor(Math.random() * 2);
    const winnerSocketId = room.players[randomIndex];
    const winnerSocket = io.sockets.sockets.get(winnerSocketId);

    const winner =
      winnerSocket?.username === rooms[roomId].hostUsername
        ? "Player1"
        : "Player2";

    io.to(roomId).emit("tossWinner", winner);
  });
  socket.on("requestRematch", ({ roomId }) => {
  const newBoard = Array(9).fill("");

  // randomly pick new toss winner
  const players = ["Player1", "Player2"];
  const turn = players[Math.floor(Math.random() * 2)];

  io.to(roomId).emit("startRematch", {
    board: newBoard,
    turn,
  });
});

  socket.on("makeMove", ({ roomId, board }) => {
    io.to(roomId).emit("updateBoard", board);
  });

  socket.on("updateStatus", async () => {
    const user = await User.findById(socket?.userid);
    user.status = "active";
    await user.save();
    io.to(socket.id).emit("updatedStatus", "online");
  });
  socket.on("PlayerLeft", () => {
    const friendsocketid = Object.entries(playerSocketMap)?.find(
      (gameid) => gameid[0] !== socket.gameid
    )[1];
    io.to(friendsocketid).emit(
      "listenPlayerLeft",
      "The other player has left."
    );
  });

  socket.on("disconnect", async () => {
    socket.broadcast.emit("checkOfflineUser", { userid: socket.gameid });
    console.log(socket.username + " disconnected:", socket.id);
    const user = await User.findById(socket.userid);
    user.status = "inactive";
    user.save();
    io.to(socket.id).emit("updatedStatus", "offline");
    const roomId = playerRoomMap[socket.id];

    if (roomId && rooms[roomId]) {
      const room = rooms[roomId];
      room.players = room.players.filter((id) => id !== socket.id);
      delete playerRoomMap[socket.id];

      if (room.players.length === 0) {
        delete rooms[roomId]; // Clean up empty room
      } else {
        const remainingPlayerId = room.players[0];
        io.to(remainingPlayerId).emit(
          "playerDisconnected",
          "The other player has disconnected."
        );
      }
    }
  });
});
connectDb().then(() => {
  server.listen(process.env.PORT || 3000, () =>
    console.log("Server running on port 3000")
  );
});

//?problem- system working when both users tap play again
