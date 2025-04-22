const express = require("express");
const cors = require("cors");
const db = require("./db");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World! Express後端伺服器運行中！");
});

// API route
app.get("/api/hello", (req, res) => {
  res.json({ message: "你好，來自 Express 後端！" });
});

app.post("/api/users", (req, res) => {
  const { name, email } = req.body;
  db.run(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, name, email });
    }
  );
});

app.listen(port, () => {
  console.log(`後端伺服器正在 http://localhost:${port} 上運行`);
});
