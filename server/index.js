require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const AuthRouter = require("./routes/AuthRouter");
const TaskRouter = require("./routes/TaskRouter");
const userRoutes = require("./routes/userRoutes"); 
require("./models/db");

// Middlewares
app.use(cors());
 
app.use(express.json());

//Routes
app.use("/auth", AuthRouter);
app.use("/api", TaskRouter);
app.use("/api", userRoutes);

// Health Check Route
app.get("/ping", (req, res) => {
  res.send("Pong");
});

//Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
