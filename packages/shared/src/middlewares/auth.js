"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const errors_1 = require("../errors");
const request_context_1 = require("./request-context");
const authenticate = () => (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return next(new errors_1.UnauthorizedError('Authorization header missing'));
    }
    const token = authHeader.substring('Bearer '.length);
    try {
        const payload = (0, jwt_1.verifyJwt)(token);
        req.user = {
            id: payload.sub,
            roles: payload.roles ?? [],
            email: payload.email,
        };
        (0, request_context_1.setRequestContext)({ userId: payload.sub, roles: payload.roles ?? [] });
        return next();
    }
    catch {
        return next(new errors_1.UnauthorizedError('Invalid token'));
    }
};
exports.authenticate = authenticate;
const authorize = (roles) => (req, _res, next) => {
    const userRoles = req.user?.roles ?? [];
    const allowed = roles.some((role) => userRoles.includes(role));
    if (!allowed) {
        return next(new errors_1.ForbiddenError('Insufficient permissions'));
    }
    return next();
};
exports.authorize = authorize;
//# sourceMappingURL=auth.js.map