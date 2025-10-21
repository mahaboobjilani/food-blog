const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const connectMongoDb = require("./config/connectionDb");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectMongoDb();

// ✅ Secure CORS Configuration
const allowedOrigins = [process.env.FRONTEND_URL,"http://localhost:5173"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// ✅ Handle Preflight Requests Explicitly
app.options("*", cors());

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Food Recipe API! Server is running."
  });
});

// Routes
app.use("/recipe", require("./routes/recipe.js"));
app.use("/", require("./routes/user.js"));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server started at port ${PORT}`);
});