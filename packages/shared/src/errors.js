"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.AppError = void 0;
class AppError extends Error {
    constructor(statusCode, code, message) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.name = this.constructor.name;
    }
}
exports.AppError = AppError;
class BadRequestError extends AppError {
    constructor(message, code = 'bad_request') {
        super(400, code, message);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(401, 'unauthorized', message);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(403, 'forbidden', message);
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends AppError {
    constructor(message = 'Not found') {
        super(404, 'not_found', message);
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends AppError {
    constructor(message = 'Conflict') {
        super(409, 'conflict', message);
    }
}
exports.ConflictError = ConflictError;
//# sourceMappingURL=errors.js.map