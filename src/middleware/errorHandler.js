const logger = require("../utils/logger");
const ERRORS = require("../constants/errors");

const errorHandler = (
    err,
    req,
    res,
    next
) => {

    const status =
        err.status ||
        ERRORS.HTTP_CODES.INTERNAL_SERVER_ERROR;

    logger.error({
        message: err.message,
        status,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        stack: err.stack,
    });

    return res.status(status).json({
        success: false,
        status,
        message:
            status >= ERRORS.HTTP_CODES.INTERNAL_SERVER_ERROR
                ? ERRORS.INTERNAL_SERVER_ERROR
                : err.message,
    });

};

module.exports = errorHandler;