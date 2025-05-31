const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./model/main.js");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 前端path
const frontPath = "http://localhost:5174";
const yourMAMADEAD = "http://localhost:5173";

// db.sequelize.sync({ alter: true });

db.sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized!");
  })
  .catch((error) => {
    console.log(error);
  });

// cors
app.use(
  cors({
    origin: [frontPath, yourMAMADEAD],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// 新增明確的健康檢查端點
app.get("/api/hello", (req, res) => {
  res.json({ message: "你好，來自 Express 後端！" });
});

// routers
require("./route/user")(app);
require("./route/agent")(app);
require("./route/questionbank")(app);
require("./route/gamerecord")(app);

const server = app.listen(PORT, () => {
  console.log(`後端伺服器正在 http://localhost:${PORT} 上運行`);
});

const io = require("socket.io")(server, {
  cors: {
    origin: [frontPath, yourMAMADEAD],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// 儲存所有房間的訊息
const rooms = {};

io.on("connection", function (socket) {
  console.log("用戶已連接:", socket.id);

  // 創建房間
  socket.on("CREATE_ROOM", function (data) {
    const { roomCode, user, socket_id } = data;

    // 初始化房間
    if (!rooms[roomCode]) {
      rooms[roomCode] = {
        messages: [],
      };
    }

    // 將 socket 加入指定房間
    socket.join(roomCode);
    console.log(`用戶 ${user} 創建並加入房間 ${roomCode}`);

    // 回傳加入成功訊息
    socket.emit("ROOM_JOINED", {
      success: true,
      messages: rooms[roomCode].messages,
    });
  });

  // 加入房間
  socket.on("JOIN_ROOM", function (data) {
    const { roomCode, user, socket_id } = data;

    // 檢查房間是否存在
    if (!rooms[roomCode]) {
      rooms[roomCode] = {
        messages: [],
      };
    }

    // 將 socket 加入指定房間
    socket.join(roomCode);
    console.log(`用戶 ${user} 加入房間 ${roomCode}`);

    // 回傳房間歷史訊息
    socket.emit("ROOM_JOINED", {
      success: true,
      messages: rooms[roomCode].messages,
    });

    // 通知房間其他人有新用戶加入
    socket.to(roomCode).emit("MESSAGE", {
      user: "系統",
      message: `${user} 已加入聊天室`,
      roomCode,
      socket_id: "system",
    });
  });

  // 發送訊息
  socket.on("SEND_MESSAGE", function (data) {
    const { roomCode, user, message, socket_id } = data;

    // 確保房間存在
    if (!rooms[roomCode]) {
      socket.emit("ERROR", { message: "房間不存在" });
      return;
    }

    console.log(`用戶 ${user} 在房間 ${roomCode} 發送訊息: ${message}`);

    // 保存訊息
    const messageData = {
      user,
      message,
      roomCode,
      socket_id,
      timestamp: new Date(),
    };
    rooms[roomCode].messages.push(messageData);

    // 訊息記錄不要無限增長
    if (rooms[roomCode].messages.length > 100) {
      rooms[roomCode].messages.shift();
    }

    // 廣播給房間所有人
    io.to(roomCode).emit("MESSAGE", messageData);
  });

  // 離開房間
  socket.on("LEAVE_ROOM", function (data) {
    const { roomCode, user } = data;

    if (roomCode) {
      socket.leave(roomCode);
      console.log(`用戶 ${user} 已離開房間 ${roomCode}`);

      // 通知房間內其他用戶
      socket.to(roomCode).emit("MESSAGE", {
        user: "系統",
        message: `${user} 已離開聊天室`,
        roomCode,
        socket_id: "system",
      });

      // 檢查房間是否已空，如果空則清理資源
      const room = io.sockets.adapter.rooms.get(roomCode);
      if (!room || room.size === 0) {
        console.log(`房間 ${roomCode} 已無人，清除房間資料`);
        delete rooms[roomCode];
      }
    }
  });

  // 斷線處理
  socket.on("disconnect", function () {
    console.log("用戶已斷線:", socket.id);
  });
});
