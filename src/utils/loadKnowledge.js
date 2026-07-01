const fs = require("fs");
const path = require("path");
const KNOWLEDGE_PATH = path.join(__dirname, "../knowledge");

let cachedKnowledge = null;

const loadKnowledge = () => {
    // Return cached knowledge if already loaded
    if (cachedKnowledge) {
        return cachedKnowledge;
    }
    try {
        const files = fs
            .readdirSync(KNOWLEDGE_PATH)
            .filter(file => file.endsWith(".md"))
            .sort();

        cachedKnowledge = files
            .map(file => {
                const content = fs.readFileSync(
                    path.join(KNOWLEDGE_PATH, file),
                    "utf8"
                );

                return `
                ==============================
                ${file.replace(".md", "").toUpperCase()}
                ==============================

                ${content}
                `;
            })
            .join("\n");
        // console.log(`Loaded ${files.length} knowledge files.`);
        return cachedKnowledge;
    } catch (error) {
        console.error("Failed to load knowledge:", error);
        return "";
    }
};

module.exports = loadKnowledge;