import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import expoRoutes from "./routes/expoRoutes.js";
import boothRoutes from "./routes/boothRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";

dotenv.config();
const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(limiter);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/expos", expoRoutes);
app.use("/api/booths", boothRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/feedback", feedbackRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
