const jwt = require("jsonwebtoken");

exports.catchErrors = fn => {
    return function(req, res, next) {
        return fn(req, res, next).catch(next);
    };
};

const buildValidationErrorMessage = err => {
    return err.inner.map(e => {
        return {
            path: e.path,
            message: e.message
        };
    });
};

exports.processErrors = (err, req, res, next) => {
    if (!err) {
        next();
    }

    if (err.name == "ValidationError" && err.inner != undefined) {
        return res.status(400).json({
            errors: buildValidationErrorMessage(err)
        });
    }

    if (err instanceof this.AppError) {
        return res.status(err.status).json({
            message: err.message
        });
    }

    if (err instanceof this.NotFoundError) {
        return res.status(404).json({
            message: err.message
        });
    }

    if (err instanceof jwt.JsonWebTokenError) {
        if (err instanceof jwt.TokenExpiredError){
            return res.status(401).json({
                message: "The reported token is expired, please log in again.",
            });
        }

        return res.status(500).json({
            message: "Error processing token, try again or generate a new one",
        });
    }

    if (err instanceof SyntaxError){
        return res.status(500).json({
            message: "Incorrect json format",
        });
    }

    console.log(err);

    return res.status(500).json({
        message: "internal server error"
    });
};

exports.AppError = class AppError extends Error {
    constructor({ status, message }) {
        super(message);

        this.name = this.constructor.name;

        Error.captureStackTrace(this, this.constructor);

        this.status = status || 500;
    }
};

exports.NotFoundError = class NotFoundError extends Error {
    constructor(message) {
        super(message);

        this.message = message;

        Error.captureStackTrace(this, this.constructor);
    }
};
