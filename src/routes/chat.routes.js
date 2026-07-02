const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");

const {
    validateChatRequest,
} = require("../middleware/validator");

router.post(
    "/",
    validateChatRequest,
    chatController.chat
);

module.exports = router;