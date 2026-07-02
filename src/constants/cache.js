module.exports = {

    /**
     * Global Prefix
     *
     * Every Redis key starts with:
     *
     * ask-ravi
     */
    PREFIX: "ask-ravi",

    /**
     * Cache Version
     *
     * Increment this whenever:
     * - System Prompt changes
     * - Knowledge Base changes
     * - Response Format changes
     *
     * This automatically invalidates all old cache entries.
     */
    VERSION: "v1",

    /**
     * Chat Cache
     */
    CHAT: {

        PREFIX: "chat",

        TTL:
            Number(process.env.REDIS_CHAT_TTL) ||
            60 * 60 * 24, // 24 Hours

    },

};