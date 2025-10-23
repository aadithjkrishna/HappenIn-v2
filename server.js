import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import profileRoutes from "./routes/profile.js";
import adminRoutes from "./routes/admin_privileges.js"
import resourceRoutes from "./routes/resource.js";
import lostFoundRoutes from "./routes/lostFound.js";
import { verifyToken } from "./middlewares/authMiddleware.js";
import { verifyAdmin } from "./middlewares/adminMiddleware.js";

// import User from "./models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is missing from the .env file!");
  process.exit(1);
}

mongoose
.connect(process.env.MONGO_URI)
.then(async () => {
  console.log("✅ Connected to MongoDB")
})
.catch((err) => {
  console.error("❌ MongoDB Connection Error:", err);
  process.exit(1);
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/resource", resourceRoutes);
app.use("/api/lost-found", lostFoundRoutes);

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "views/home/index.html"));
// });

app.use(express.static(path.join(__dirname, "client/build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "views/login/index.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "views/signup/index.html"));
});

app.get("/forgot-password", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "views/forgot-password/index.html"));
});

app.get("/calendar", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "views/calendar/index.html"));
});

app.get("/event-register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "views/event-register/index.html"));
});

app.get("/lost-found", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "views/lost-found/index.html"));
});

app.get("/book-resources", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "views/book-resources/index.html"));
});

app.get("/faculty", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "views/faculty/index.html"));
});

app.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "views/profile/index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "views/about/index.html"));
});

// app.get("/mini-games", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "views/mini-games/index.html"));
// });

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "views/admin/index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "views/error404/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port http://localhost:${PORT}`));