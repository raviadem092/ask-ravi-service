require("dotenv").config();

const app = require("./src/app");
const logger = require("./src/utils/logger");

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
    logger.info(`Ask Ravi Service running on port ${PORT}`);
});

/**
 * Server startup error
 */
server.on("error", (error) => {
    logger.error(error);
    process.exit(1);
});

/**
 * Graceful shutdown
 */
process.on("SIGINT", () => {
    logger.info("Shutting down Ask Ravi Service...");
    server.close(() => process.exit(0));
});

process.on("SIGTERM", () => {
    logger.info("Shutting down Ask Ravi Service...");
    server.close(() => process.exit(0));
});