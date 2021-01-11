const createError = require("http-errors");
const http = require("http");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");

require("dotenv").config(); // Include .env variables
require("./utils/redis");
require("./config/db"); // Iniatialize db
const {
    app: { port },
} = require("./config/config");

// Include middlewares

// Include API's routes
const authRouter = require("./routes/authRouter");
const postRouter = require("./routes/postRouter");
const profileRouter = require("./routes/profileRouter");
// Iniatialize server & app
const app = express();
app.set("port", port);
app.set("env", process.env.ENV);
const server = http.createServer(app);

// Iniatialize extensions

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// add external url to req param
app.use((req, res, next) => {
    req.externalURL = `${req.protocol}://${req.hostname}:${req.app.settings.port}`;
    next();
});

// Use the middlewares

// Iniatialize static folder

app.use(express.static(path.join(__dirname, "public")));

// Iniatialize API's endpoints

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/feed", postRouter);
app.use("/api/v1/user", profileRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    const error = {
        msg: err.message,
        code: err.code,
    };

    // return json response to client
    res.status(err.status || 500);
    res.json({ error });
});

module.exports = server;
