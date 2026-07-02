const express = require("express");
const cors = require("cors");
const healthRoutes = require("./routes/health.routes");
const chatRoutes = require("./routes/chat.routes");
const questionRoutes = require("./routes/question.routes");
const HTTP_CODES = require("./constants/errors");
const errorHandler = require("./middleware/errorHandler");

const app = express();

/**
 * Middlewares
 */
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
    })
);

app.use(
    express.json({
        limit: "2mb",
    })
);

/**
 * Root
 */
app.get("/", (req, res) => {
    res.status().json({
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