require("dotenv").config();

const app = require("./src/app");
const logger = require("./src/utils/logger");
const {
    connectRedis,
} = require("./src/config/redis");

const PORT = process.env.PORT || 3001;

(async () => {

    try {

        await connectRedis();

        const server = app.listen(PORT, () => {
            logger.info(
                `Ask Ravi Service running on port ${PORT}`
            );
        });

        process.on("SIGINT", async () => {

            logger.info("Gracefully shutting down...");

            server.close(async () => {

                process.exit(0);

            });

        });

    } catch (error) {

        logger.error(error);

        process.exit(1);

    }

})();