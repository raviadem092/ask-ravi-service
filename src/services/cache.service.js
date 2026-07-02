const { redisClient } = require("../config/redis");
const CACHE = require("../constants/cache");
const logger = require("../utils/logger");

class CacheService {

    /**
     * Build Redis Key
     *
     * Example:
     * ask-ravi:v1:chat:xxxxxxxx
     */
    buildKey(prefix, key) {

        return [
            CACHE.PREFIX,
            CACHE.VERSION,
            prefix,
            key,
        ].join(":");

    }

    /**
     * Get Value
     */
    async get(key) {

        try {

            const value = await redisClient.get(key);

            if (!value) {
                return null;
            }

            try {
                return JSON.parse(value);
            } catch {
                return value;
            }

        } catch (error) {

            logger.error({
                message: "Redis GET failed",
                key,
                stack: error.stack,
            });

            return null;

        }

    }

    /**
     * Set Value
     */
    async set(
        key,
        value,
        ttl = CACHE.CHAT.TTL
    ) {

        try {

            await redisClient.set(
                key,
                JSON.stringify(value),
                {
                    EX: ttl,
                }
            );

            logger.info({
                message: "Redis cache updated",
                key,
            });

        } catch (error) {

            logger.error({
                message: "Redis SET failed",
                key,
                stack: error.stack,
            });

        }

    }

    /**
     * Delete Value
     */
    async delete(key) {

        try {

            await redisClient.del(key);

        } catch (error) {

            logger.error({
                message: "Redis DELETE failed",
                key,
                stack: error.stack,
            });

        }

    }

    /**
     * Check Key Exists
     */
    async exists(key) {

        try {

            return Boolean(
                await redisClient.exists(key)
            );

        } catch (error) {

            logger.error({
                message: "Redis EXISTS failed",
                key,
                stack: error.stack,
            });

            return false;

        }

    }

    /**
     * Get TTL
     */
    async ttl(key) {

        try {

            return await redisClient.ttl(key);

        } catch (error) {

            logger.error({
                message: "Redis TTL failed",
                key,
                stack: error.stack,
            });

            return -1;

        }

    }

    /**
     * Clear Cache By Prefix
     *
     * NOTE:
     * Uses KEYS command.
     * Suitable for small projects.
     * Replace with SCAN for large datasets.
     */
    async clear(prefix) {

        try {

            const pattern = [
                CACHE.PREFIX,
                CACHE.VERSION,
                prefix,
                "*",
            ].join(":");

            const keys = await redisClient.keys(pattern);

            if (keys.length > 0) {
                await redisClient.del(keys);
            }

        } catch (error) {

            logger.error({
                message: "Redis CLEAR failed",
                prefix,
                stack: error.stack,
            });

        }

    }

}

module.exports = new CacheService();