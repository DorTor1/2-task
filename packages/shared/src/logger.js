"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHttpLogger = exports.createLogger = void 0;
const node_crypto_1 = require("node:crypto");
const pino_1 = __importDefault(require("pino"));
const pino_http_1 = __importDefault(require("pino-http"));
const request_context_1 = require("./middlewares/request-context");
const createLogger = ({ serviceName, level = 'info' }) => (0, pino_1.default)({
    name: serviceName,
    level,
    formatters: {
        level(label) {
            return { level: label };
        },
    },
    timestamp: pino_1.default.stdTimeFunctions.isoTime,
});
exports.createLogger = createLogger;
const createHttpLogger = (options, extra) => {
    const baseLogger = (0, exports.createLogger)(options);
    return (0, pino_http_1.default)({
        logger: baseLogger,
        redact: {
            paths: ['req.headers.authorization', '*.password', '*.token'],
        },
        genReqId: (req) => {
            const headerId = req.headers['x-request-id'];
            return (Array.isArray(headerId) ? headerId[0] : headerId) ?? (0, node_crypto_1.randomUUID)();
        },
        customProps: () => {
            const ctx = (0, request_context_1.getRequestContext)();
            return ctx ? { requestId: ctx.requestId, userId: ctx.userId } : {};
        },
        customLogLevel: (res, err) => {
            const status = res.statusCode ?? 200;
            if (err || status >= 500)
                return 'error';
            if (status >= 400)
                return 'warn';
            return 'info';
        },
        ...extra,
    });
};
exports.createHttpLogger = createHttpLogger;
//# sourceMappingURL=logger.js.map