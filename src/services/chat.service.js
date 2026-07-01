const ai = require("../config/gemini");
const SYSTEM_PROMPT = require("../prompts/systemPrompt");
const loadKnowledge = require("../utils/loadKnowledge");
const MODEL = "gemini-2.5-flash";

// Load knowledge once when the service starts
const KNOWLEDGE = loadKnowledge();

const generateResponse = async (message) => {
    try {
        const prompt = `
        ${SYSTEM_PROMPT}
        ==============================
        PORTFOLIO KNOWLEDGE
        ==============================
        ${KNOWLEDGE}
        ==============================
        USER QUESTION
        ==============================

        ${message}
        `;
        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt
        });
        return response.text;
    } catch (error) {
        console.error("Gemini Error:", error);
        throw new Error("Failed to generate AI response.");
    }
};

module.exports = {
    generateResponse
};