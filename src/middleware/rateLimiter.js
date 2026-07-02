const rateLimit = require("express-rate-limit");

const ERRORS = require("../constants/errors");
const RATE_LIMIT = require("../constants/rateLimit");
const logger = require("../utils/logger");

/**
 * Create Rate Limiter
 */
const createRateLimiter = ({
    windowMs,
    max,
    message,
}) => {

    return rateLimit({

        windowMs,

        max,

        standardHeaders: true,

        legacyHeaders: false,

        skipSuccessfulRequests: false,

        skip: () =>
            process.env.NODE_ENV === "test",

        handler: (req, res) => {

            logger.warn({
                message: "Rate limit exceeded",
                method: req.method,
                path: req.originalUrl,
                ip: req.ip,
            });

            return res.status(
                ERRORS.HTTP_CODES.TOO_MANY_REQUESTS
            ).json({
                success: false,
                status:
                    ERRORS.HTTP_CODES.TOO_MANY_REQUESTS,
                message,
            });

        },

    });

};

/**
 * Chat API Rate Limiter
 */
const chatRateLimiter = createRateLimiter({

    windowMs:
        RATE_LIMIT.CHAT.WINDOW_MS,

    max:
        RATE_LIMIT.CHAT.MAX_REQUESTS,

    message:
        ERRORS.TOO_MANY_REQUESTS,

});

module.exports = {
    chatRateLimiter,
    createRateLimiter,
};