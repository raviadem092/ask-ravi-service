const ERRORS = require("../constants/errors");

const validateChatRequest = (
    req,
    res,
    next
) => {

    const { message, history } = req.body;

    /**
     * Message
     */
    if (
        typeof message !== "string" ||
        !message.trim()
    ) {

        const err = new Error(
            ERRORS.MESSAGE_REQUIRED
        );

        err.status =
            ERRORS.HTTP_CODES.BAD_REQUEST;

        return next(err);

    }

    /**
     * Max Length
     */
    if (message.length > 1000) {

        const err = new Error(
            ERRORS.MESSAGE_TOO_LONG
        );

        err.status =
            ERRORS.HTTP_CODES.BAD_REQUEST;

        return next(err);

    }

    /**
     * History
     */
    if (
        history !== undefined &&
        !Array.isArray(history)
    ) {

        const err = new Error(
            ERRORS.INVALID_HISTORY
        );

        err.status =
            ERRORS.HTTP_CODES.BAD_REQUEST;

        return next(err);

    }

    /**
     * History Items
     */
    if (Array.isArray(history)) {

        for (const item of history) {

            if (
                !item ||
                typeof item !== "object"
            ) {

                const err = new Error(
                    ERRORS.INVALID_HISTORY
                );

                err.status =
                    ERRORS.HTTP_CODES.BAD_REQUEST;

                return next(err);

            }

            if (
                !["user", "assistant"].includes(
                    item.role
                )
            ) {

                const err = new Error(
                    ERRORS.INVALID_HISTORY
                );

                err.status =
                    ERRORS.HTTP_CODES.BAD_REQUEST;

                return next(err);

            }

            if (
                typeof item.content !== "string"
            ) {

                const err = new Error(
                    ERRORS.INVALID_HISTORY
                );

                err.status =
                    ERRORS.HTTP_CODES.BAD_REQUEST;

                return next(err);

            }

        }

    }

    next();

};

module.exports = {
    validateChatRequest,
};