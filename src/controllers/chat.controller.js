const chatService = require("../services/chat.service");

exports.chat = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required."
            });
        }
        const answer = await chatService.generateResponse(message);
        return res.status(200).json({
            success: true,
            answer
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};