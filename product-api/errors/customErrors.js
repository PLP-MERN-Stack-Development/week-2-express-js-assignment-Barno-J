class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}

class NotFoundError extends CustomError {
    constructor(message) {
        super(message, 404);
    }
}

class ValidationError extends CustomError {
    constructor(message) {
        super(message, 400);
    }
}

module.exports = { CustomError, NotFoundError, ValidationError };