"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRequestContext = exports.requestContextMiddleware = exports.getRequestContext = void 0;
const node_async_hooks_1 = require("node:async_hooks");
const node_crypto_1 = __importDefault(require("node:crypto"));
const storage = new node_async_hooks_1.AsyncLocalStorage();
const getRequestContext = () => storage.getStore();
exports.getRequestContext = getRequestContext;
const requestContextMiddleware = (req, _res, next) => {
    const requestIdHeader = req.headers['x-request-id'];
    const requestId = Array.isArray(requestIdHeader)
        ? requestIdHeader[0]
        : requestIdHeader ?? node_crypto_1.default.randomUUID();
    storage.run({
        requestId,
        traceId: req.headers['x-trace-id'],
        spanId: req.headers['x-span-id'],
    }, () => next());
};
exports.requestContextMiddleware = requestContextMiddleware;
const setRequestContext = (data) => {
    const store = storage.getStore();
    if (!store) {
        storage.enterWith(data);
        return;
    }
    Object.assign(store, data);
};
exports.setRequestContext = setRequestContext;
//# sourceMappingURL=request-context.js.map