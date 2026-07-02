const ERRORS = require("../constants/errors");
exports.health = (req, res) => {
    res.status(ERRORS.HTTP_CODES.OK).json({
        success: true,
        data: {
            service: "Ask Ravi Service",
            status: "UP",
            version: "1.0.0",
            timestamp: new Date().toISOString(),
            uptime: `${process.uptime().toFixed(2)} seconds`
        }
    });
};