const { isUserActive, getSessions } = require("../utils/redis");
const { chatValidator } = require("../utils/validationSchema");
// handle socket.io events here
const typingEvent = async (socket, payload) => {
    try {
        let data = await chatValidator(payload, { userId: 1, convId: 1 });
        let isActive = await isUserActive(data.userId);
        if (isActive) {
            let sessionIds = await getSessions(data.userId);
            sessionIds.forEach((id) => {
                socket.to(id);
            });
            // emit the message event
            socket.emit("typing", { convId: data.convId });
        }
    } catch (err) {
        socket.emit("error", err);
    }
};

module.exports = {
    typingEvent,
};
