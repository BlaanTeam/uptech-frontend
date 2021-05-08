const createError = require("http-errors");
const http = require("http");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

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
const chatRouter = require("./routes/chatRouter");
// Iniatialize server & app
const app = express();
app.set("port", port);
app.set("env", process.env.ENV);
const server = http.createServer(app);

// Iniatialize extensions

app.use(helmet());
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// add external url to req param
app.use((req, res, next) => {
    // req.externalURL = `${req.protocol}://${req.hostname}:${req.app.settings.port}`; // production
    req.externalURL = `${req.protocol}://${req.hostname}:8080`; // development
    next();
});

// Use the middlewares

// Iniatialize static folder

app.use(express.static(path.join(__dirname, "public")));

// Iniatialize API's endpoints

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/feed", postRouter);
app.use("/api/v1/users", profileRouter);
app.use("/api/v1/chats", chatRouter);

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
