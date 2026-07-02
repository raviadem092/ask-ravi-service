const crypto = require("crypto");

/**
 * Generate SHA-256 Hash
 *
 * @param {string} value
 * @returns {string}
 */
const generateHash = (value) => {

    return crypto
        .createHash("sha256")
        .update(String(value))
        .digest("hex");

};

module.exports = {
    generateHash,
};