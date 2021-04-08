const { isUserActive, getSessions } = require("../utils/redis");
const { chatValidator } = require("../utils/validationSchema");
// handle socket.io events here
const typingEvent = async (socket, payload) => {
    try {
        let data = await chatValidator(payload, { userId: 1, convId: 1 });
        console.log(data);
        let isActive = await isUserActive(data.userId);
        console.log(isActive);
        if (isActive) {
            let sessionIds = await getSessions(data.userId);
            sessionIds.forEach((id) => {
                socket.to(id);
            });
            // emit the message event
            socket.emit("typing", { convId: data.convId });
        }
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    typingEvent,
};
