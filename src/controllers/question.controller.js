const suggestedQuestions = require("../constants/questions");
const ERRORS = require("../constants/errors");
exports.getSuggestedQuestions = (req, res) => {
    res.status(ERRORS.HTTP_CODES.OK).json({
        success: true,
        data: suggestedQuestions
    });
};