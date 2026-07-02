const {
    createLogger,
    format,
    transports,
} = require("winston");

const isProduction =
    process.env.NODE_ENV === "production";

const logger = createLogger({

    level:
        process.env.LOG_LEVEL || "info",

    defaultMeta: {
        service: "ask-ravi-service",
    },

    format: isProduction

        ? format.combine(

              format.timestamp(),

              format.errors({
                  stack: true,
              }),

              format.json()

          )

        : format.combine(

              format.colorize(),

              format.timestamp({
                  format: "YYYY-MM-DD HH:mm:ss",
              }),

              format.errors({
                  stack: true,
              }),

              format.printf((info) => {

                  const {
                      timestamp,
                      level,
                      message,
                      stack,
                      ...meta
                  } = info;

                  let log =
                      `[${timestamp}] ${level}: ${message || ""}`;

                  if (Object.keys(meta).length) {
                      log +=
                          ` ${JSON.stringify(meta)}`;
                  }

                  if (stack) {
                      log += `\n${stack}`;
                  }

                  return log;

              })

          ),

    transports: [
        new transports.Console(),
    ],

});

module.exports = logger;