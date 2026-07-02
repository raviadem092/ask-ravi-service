const logger = require("../utils/logger");

const allowedOrigins = (
    process.env.CLIENT_URLS || ""
)
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean);

const corsOptions = {

    origin(origin, callback) {

        /**
         * Allow:
         * - Postman
         * - Curl
         * - Server-to-server requests
         */
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        logger.warn({
            message: "Blocked by CORS",
            origin,
        });

        return callback(
            new Error("Not allowed by CORS")
        );

    },

    credentials: true,

    methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS",
    ],

    allowedHeaders: [
        "Content-Type",
        "Authorization",
    ],

};

module.exports = corsOptions;