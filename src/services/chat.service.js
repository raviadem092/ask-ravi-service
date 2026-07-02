const ai = require("../config/gemini");
const SYSTEM_PROMPT = require("../prompts/systemPrompt");
const loadKnowledge = require("../utils/loadKnowledge");
const logger = require("../utils/logger");
const MODEL = "gemini-2.5-flash";
const ERRORS = require("../constants/errors");

const KNOWLEDGE = loadKnowledge();

const buildConversationHistory = (history = []) => {

    if (!history.length) {
        return "";
    }

    return history
        .map(item => {

            const role =
                item.role === "assistant"
                    ? "Assistant"
                    : "User";

            return `${role}: ${item.content}`;

        })
        .join("\n\n");

};

const generateResponse = async (
    message,
    history = []
) => {

    try {

        const conversation =
            buildConversationHistory(history);

        const prompt = `
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

        const response =
            await ai.models.generateContent({

                model: MODEL,

                contents: prompt,

            });

        return response.text;

    } catch (error) {
        logger.error(
            `Gemini Error: ${error.message}`,
            {
                status: error.status,
                stack: error.stack,
            }
        );

        if (error.status === ERRORS.HTTP_CODES.RATE_LIMIT_EXCEEDED) {

            const err = new Error(ERRORS.AI_BUSY);
            err.status = ERRORS.HTTP_CODES.RATE_LIMIT_EXCEEDED;
            throw err;

        }

        if (error.status === ERRORS.HTTP_CODES.SERVICE_UNAVAILABLE) {

            const err = new Error(ERRORS.AI_UNAVAILABLE);
            err.status = ERRORS.HTTP_CODES.SERVICE_UNAVAILABLE;
            throw err;

        }

        const err = new Error(ERRORS.INTERNAL_SERVER_ERROR);
        err.status = ERRORS.HTTP_CODES.INTERNAL_SERVER_ERROR;

        throw err;
    }
};

module.exports = {
    generateResponse,
};