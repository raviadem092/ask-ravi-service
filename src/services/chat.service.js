const ai = require("../config/gemini");
const SYSTEM_PROMPT = require("../prompts/systemPrompt");
const loadKnowledge = require("../utils/loadKnowledge");

const MODEL = "gemini-2.5-flash";

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
        console.error("Gemini Error:", error);
        if (error.status === 429) {
            throw new Error(
                "⚠️ Ask Ravi is receiving a lot of requests right now. Please try again in a few moments."
            );

        }
        if (error.status === 503) {

            throw new Error(
                "The AI service is currently experiencing high demand. Please try again in a moment."
            );
        }
        throw new Error(
            "Unable to generate a response right now."
        );
    }
};

module.exports = {
    generateResponse,
};