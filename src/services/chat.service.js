const ai = require("../config/gemini");

const SYSTEM_PROMPT = require("../prompts/systemPrompt");

const loadKnowledge = require("../utils/loadKnowledge");

const cacheService = require("./cache.service");

const CACHE = require("../constants/cache");

const ERRORS = require("../constants/errors");

const logger = require("../utils/logger");

const { generateHash } = require("../utils/hash");

const MODEL = "gemini-2.5-flash";

/**
 * Load Portfolio Knowledge Once
 */
const KNOWLEDGE = loadKnowledge();

/**
 * Build Conversation History
 */
const buildConversationHistory = (history = []) => {

    if (!Array.isArray(history) || !history.length) {
        return "";
    }

    return history
        .map(({ role, content }) => {

            const speaker =
                role === "assistant"
                    ? "Assistant"
                    : "User";

            return `${speaker}: ${content}`;

        })
        .join("\n\n");

};

/**
 * Build Gemini Prompt
 */
const buildPrompt = (
    message,
    history
) => {

    const conversation =
        buildConversationHistory(history);

    return `
${SYSTEM_PROMPT}

======================================
PORTFOLIO KNOWLEDGE
======================================

${KNOWLEDGE}

======================================
PREVIOUS CONVERSATION
======================================

${conversation}

======================================
CURRENT USER QUESTION
======================================

${message}
`;

};

/**
 * Generate AI Response
 */
const generateResponse = async (
    message,
    history = []
) => {

    try {

        /**
         * Build Cache Key
         */
        const cacheKey =
            cacheService.buildKey(

                CACHE.CHAT.PREFIX,

                generateHash(
                    JSON.stringify({
                        message,
                        history,
                    })
                )

            );

        /**
         * Cache Lookup
         */
        const cachedAnswer =
            await cacheService.get(cacheKey);

        if (cachedAnswer) {

            logger.info({
                event: "CACHE_HIT",
                key: cacheKey,
            });

            return cachedAnswer;

        }

        logger.info({
            event: "CACHE_MISS",
            key: cacheKey,
        });

        /**
         * Gemini Prompt
         */
        const prompt =
            buildPrompt(
                message,
                history
            );

        /**
         * Gemini API
         */
        const response =
            await ai.models.generateContent({

                model: MODEL,

                contents: prompt,

            });

        const answer =
            response.text;

        /**
         * Save Cache
         */
        await cacheService.set(

            cacheKey,

            answer,

            CACHE.CHAT.TTL

        );

        logger.info({
            event: "CACHE_STORED",
            key: cacheKey,
        });

        return answer;

    } catch (error) {

        logger.error({
            message: "Gemini Error",
            status: error.status,
            stack: error.stack,
        });

        if (
            error.status ===
            ERRORS.HTTP_CODES.TOO_MANY_REQUESTS
        ) {

            const err = new Error(
                ERRORS.AI_RATE_LIMIT_EXCEEDED
            );

            err.status =
                ERRORS.HTTP_CODES.TOO_MANY_REQUESTS;

            throw err;

        }

        if (
            error.status ===
            ERRORS.HTTP_CODES.SERVICE_UNAVAILABLE
        ) {

            const err = new Error(
                ERRORS.AI_UNAVAILABLE
            );

            err.status =
                ERRORS.HTTP_CODES.SERVICE_UNAVAILABLE;

            throw err;

        }

        const err = new Error(
            ERRORS.INTERNAL_SERVER_ERROR
        );

        err.status =
            ERRORS.HTTP_CODES.INTERNAL_SERVER_ERROR;

        throw err;

    }

};

module.exports = {
    generateResponse,
};