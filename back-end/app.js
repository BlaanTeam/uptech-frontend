const createError = require("http-errors");
const http = require("http");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");

require("dotenv").config(); // Include .env variables
require("./config/db"); // Iniatialize db
const {
  app: { port },
} = require("./config/config");

// Include middlewares

// Include API's routes
const authRouter = require("./routes/authRouter");

// Iniatialize server & app
const app = express();
const server = http.createServer(app);

// Iniatialize extensions

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use the middlewares

// Iniatialize static folder

app.use(express.static(path.join(__dirname, "public")));

// Iniatialize API's endpoints

app.use("/api/v1/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  const error = {
    msg: err.message,
  };

  // return json response to client
  res.status(err.status || 500);
  res.json({ error });
});

// set port to express

app.set("port", port);

module.exports = server;
