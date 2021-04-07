const redis = require("redis");
const { redisConfig } = require("../config/config");

const client = redis.createClient(redisConfig);
const { promisify } = require("util");

client.on("connect", () => {
    console.log("Redis Connected !");
});

client.on("error", function (error) {
    console.error(error);
});

client.getAsync = promisify(client.get).bind(client);
client.setAsync = promisify(client.set).bind(client);
client.sadd = promisify(client.sadd).bind(client);
client.sismember = promisify(client.sismember).bind(client);
client.smembers = promisify(client.smembers).bind(client);
client.srem = promisify(client.srem).bind(client);

const addActiveUser = async (userId) => {
    try {
        await client.sadd("active_users", userId.toString());
    } catch (err) {
        throw err;
    }
};

const isUserActive = async (userId) => {
    try {
        return await client.sismember("active_users", userId.toString());
    } catch (err) {
        throw err;
    }
};

const addSession = async (userId, sessionId) => {
    try {
        await client.sadd(
            `${userId.toString()}:sessions`,
            sessionId.toString()
        );
    } catch (err) {
        throw err;
    }
};

const getSessions = async (userId) => {
    try {
        return await client.smembers(`${userId.toString()}:sessions`);
    } catch (err) {
        throw err;
    }
};

const removeSession = async (userId, sessionId) => {
    try {
        await client.srem(
            `${userId.toString()}:sessions`,
            sessionId.toString()
        );
    } catch (err) {
        throw err;
    }
};

const removeActiveUser = async (userId, sessionId) => {
    try {
        let sessions = await getSessions(userId);
        if (sessions.length <= 1) {
            await client.srem("active_users", userId.toString());
            await removeSession(userId, sessionId);
        } else {
            await removeSession(userId, sessionId);
        }
    } catch (err) {
        throw err;
    }
};

module.exports = {
    client,
    addActiveUser,
    isUserActive,
    addSession,
    removeSession,
    getSessions,
    removeActiveUser,
};
