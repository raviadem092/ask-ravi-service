const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

const ERRORS = require("./constants/errors");
const corsOptions =
    require("./config/cors");

const requestLogger = require("./middleware/requestLogger");
const errorHandler = require("./middleware/errorHandler");

const healthRoutes = require("./routes/health.routes");
const chatRoutes = require("./routes/chat.routes");
const questionRoutes = require("./routes/question.routes");

const app = express();

/**
 * Request Logger
 */
app.use(requestLogger);

/**
 * Security Headers
 */
app.use(
    helmet({

        hidePoweredBy: true,

        frameguard: {
            action: "deny",
        },

        noSniff: true,

        referrerPolicy: {
            policy: "strict-origin-when-cross-origin",
        },

        /**
         * We'll configure CSP later
         */
        contentSecurityPolicy: false,

        /**
         * Disable for React + external resources
         */
        crossOriginEmbedderPolicy: false,

    })
);


/**
 * Response Compression
 */
app.use(
    compression({

        /**
         * Skip tiny responses
         */
        threshold: "1kb",

        /**
         * Respect Cache-Control: no-transform
         */
        filter: (req, res) => {

            if (
                res.getHeader("Cache-Control") ===
                "no-transform"
            ) {
                return false;
            }

            return compression.filter(req, res);

        },

    })
);

/**
 * CORS
 */
app.use(
    cors(corsOptions)
);

/**
 * Body Parser
 */
app.use(
    express.json({
        limit: "2mb",
    })
);

/**
 * Root
 */
app.get("/", (req, res) => {

    return res.status(ERRORS.HTTP_CODES.OK).json({
        success: true,
        message: "Ask Ravi Service is running.",
    });

});

/**
 * Routes
 */
app.use("/api/chat", chatRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/health", healthRoutes);

/**
 * Global Error Handler
 */
app.use(errorHandler);

module.exports = app;