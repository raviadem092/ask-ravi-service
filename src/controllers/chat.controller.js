const chatService = require("../services/chat.service");
const ERRORS = require("../constants/errors");

exports.chat = async (req, res) => {
    try {

        const {
            message,
            history = [],
        } = req.body;

        const answer = await chatService.generateResponse(
            message,
            history
        );

        return res.status(ERRORS.HTTP_CODES.OK).json({
            success: true,
            answer
        });

    } catch (error) {

        console.error(error);

        return res.status(ERRORS.HTTP_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });

    }
};