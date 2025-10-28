"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.traceMiddleware = void 0;
const node_crypto_1 = require("node:crypto");
const request_context_1 = require("../middlewares/request-context");
const traceMiddleware = (req, res, next) => {
    const traceId = req.headers['x-trace-id'] ?? (0, node_crypto_1.randomUUID)();
    const spanId = (0, node_crypto_1.randomUUID)();
    (0, request_context_1.setRequestContext)({ traceId, spanId });
    res.setHeader('x-trace-id', traceId);
    res.setHeader('x-span-id', spanId);
    next();
};
exports.traceMiddleware = traceMiddleware;
//# sourceMappingURL=trace.js.map