// const express=require("express");
// const app=express();

// const cors=require('cors')

// const dotenv=require("dotenv").config();
// const connectMongoDb=require("./config/connectionDb")
// const PORT=process.env.PORT || 3000

// connectMongoDb()

// app.use(express.json());
// app.use(cors());
// app.use(express.static('public'));

// app.use("/recipe",require('./routes/recipe.js'))
// app.use("/",require('./routes/user.js'))

// app.listen(PORT, () => {
//   console.log(`Server started at port ${PORT}`);
// });

const express = require("express");
const app = express();

const cors = require("cors");
const dotenv = require("dotenv").config();
const connectMongoDb = require("./config/connectionDb");
const PORT = process.env.PORT || 3000;

connectMongoDb();

// ✅ Secure CORS Configuration
const allowedOrigins = [process.env.FRONTEND_URL];

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

// Routes
app.use("/recipe", require("./routes/recipe.js"));
app.use("/", require("./routes/user.js"));

// Server
app.listen(PORT, () => {
  console.log(`🚀 Server started at port ${PORT}`);
});

