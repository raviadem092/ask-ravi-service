const suggestedQuestions = require("../constants/questions");

exports.getSuggestedQuestions = (req, res) => {
    res.status(200).json({
        success: true,
        data: suggestedQuestions
    });
};