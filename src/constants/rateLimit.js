module.exports = {

    /**
     * Chat API
     */
    CHAT: {

        WINDOW_MS:
            Number(process.env.CHAT_RATE_LIMIT_WINDOW_MS) ||
            15 * 60 * 1000, // 15 Minutes

        MAX_REQUESTS:
            Number(process.env.CHAT_RATE_LIMIT_MAX_REQUESTS) ||
            100,

    },

    /**
     * Contact API (Future)
     */
    CONTACT: {

        WINDOW_MS:
            Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MS) ||
            60 * 60 * 1000, // 1 Hour

        MAX_REQUESTS:
            Number(process.env.CONTACT_RATE_LIMIT_MAX_REQUESTS) ||
            10,

    },

    /**
     * Authentication API (Future)
     */
    AUTH: {

        WINDOW_MS:
            Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS) ||
            15 * 60 * 1000,

        MAX_REQUESTS:
            Number(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS) ||
            5,

    },

};