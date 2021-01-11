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

module.exports = client;
