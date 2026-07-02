const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");

const {
    validateChatRequest,
} = require("../middleware/validator");

const {
    chatRateLimiter,
} = require("../middleware/rateLimiter");

router.post(
    "/",
    validateChatRequest,
    chatRateLimiter,
    chatController.chat
);

module.exports = router;