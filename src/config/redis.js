const { createClient } = require("redis");
const logger = require("../utils/logger");

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    },

    password:
        process.env.REDIS_PASSWORD || undefined,

    database:
        Number(process.env.REDIS_DATABASE) || 0,
});

/**
 * Redis Events
 */
redisClient.on("connect", () => {
    logger.info("Connecting to Redis...");
});

redisClient.on("ready", () => {
    logger.info("Redis connected successfully.");
});

redisClient.on("reconnecting", () => {
    logger.warn("Reconnecting to Redis...");
});

redisClient.on("end", () => {
    logger.warn("Redis connection closed.");
});

redisClient.on("error", (error) => {
    logger.error({
        message: "Redis connection error",
        stack: error.stack,
    });
});

/**
 * Connect Redis
 */
const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
};

/**
 * Disconnect Redis
 */
const disconnectRedis = async () => {
    if (redisClient.isOpen) {
        await redisClient.quit();
    }
};

module.exports = {
    redisClient,
    connectRedis,
    disconnectRedis,
};