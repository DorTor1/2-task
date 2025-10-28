"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errors_1 = require("../errors");
const request_context_1 = require("./request-context");
const errorHandler = (err, _req, res, _next) => {
    const ctx = (0, request_context_1.getRequestContext)();
    if (err instanceof errors_1.AppError) {
        res.status(err.statusCode).json({
            success: false,
            error: {
                code: err.code,
                message: err.message,
                requestId: ctx?.requestId,
            },
        });
        return;
    }
    res.status(500).json({
        success: false,
        error: {
            code: 'internal_error',
            message: 'Internal server error',
            requestId: ctx?.requestId,
        },
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error-handler.js.map