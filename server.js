const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// =======================
// MIDDLEWARE
// =======================
app.use(express.json());
app.use(express.static("public"));

// =======================
// PATHS
// =======================
const dataPath = path.join(__dirname, "data", "users.json");

// =======================
// POST: SAVE FORM DATA
// =======================
app.post("/submit", (req, res) => {
  const newUser = req.body;

  fs.readFile(dataPath, "utf8", (err, data) => {
    let users = [];

    if (!err && data) {
      users = JSON.parse(data);
    }

    const exists = users.find(u => u.email === newUser.email);
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    users.push(newUser);

    fs.writeFile(dataPath, JSON.stringify(users, null, 2), err => {
      if (err) {
        return res.status(500).json({ message: "Failed to save data" });
      }

      res.json({ message: "Portfolio saved successfully" });
    });
  });
});

// =======================
// GET USER DATA (API)
// =======================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/api/user/:username", (req, res) => {
  const username = req.params.username.toLowerCase();

  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading database" });
    }

    const users = JSON.parse(data);

    const user = users.find(
      u => u.name.toLowerCase().replace(/\s+/g, "") === username
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  });
});

// =======================
// PORTFOLIO PAGE ROUTE
// =======================
app.get("/:username", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "portfolio.html"));
});
console.log("NEW USER SUBMITTED:", userData);

// =======================
// START SERVER
// =======================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});