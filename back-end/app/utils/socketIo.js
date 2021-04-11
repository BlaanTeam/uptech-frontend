const io = require("socket.io")(null, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "OPTIONS", "DELETE"],
        allowedHeaders: ["x-auth-token"],
    },
});
const { protectSocketIo } = require("../utils/middlewares");
const { typingEvent, markReadEvent } = require("../controllers/socketEvents");
const {
    addActiveUser,
    isUserActive,
    addSession,
    removeActiveUser,
} = require("./redis");

// check if the access token is passed in headers
io.use(protectSocketIo);

io.on("connection", async (socket) => {
    console.log("Client Connected !");
    // register events
    socket.on("disconnect", async () => {
        console.log("Client Disconnected !");
        // remove user from online users
        await removeActiveUser(socket.currentUser._id, socket.id);
    });
    socket.on("typing", async (data) => await typingEvent(socket, data));
    socket.on("mark-read", async (data) => await markReadEvent(socket, data));
    // check if the user is active
    let isActive = await isUserActive(socket.currentUser._id);
    if (isActive) {
        // add session to active sessions
        await addSession(socket.currentUser._id, socket.id);
    } else {
        // add new session & add user to online users
        await addActiveUser(socket.currentUser._id);
        await addSession(socket.currentUser._id, socket.id);
    }
});

io.on("error", (error) => {
    console.error(error);
});

module.exports = io;
