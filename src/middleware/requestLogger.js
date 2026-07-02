const logger = require("../utils/logger");

const requestLogger = (
    req,
    res,
    next
) => {

    const start = Date.now();

    res.on("finish", () => {

        logger.info({

            method: req.method,

            url: req.originalUrl,

            status: res.statusCode,

            duration:
                Date.now() - start,

            ip: req.ip,

            userAgent:
                req.get("User-Agent"),

        });

    });

    next();

};

module.exports = requestLogger;