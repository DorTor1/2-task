"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userQuerySchema = exports.userProfileUpdateSchema = exports.userLoginSchema = exports.userRegistrationSchema = void 0;
const zod_1 = require("zod");
exports.userRegistrationSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    name: zod_1.z.string().min(1),
});
exports.userLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
exports.userProfileUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    roles: zod_1.z.array(zod_1.z.enum(['engineer', 'manager', 'admin', 'supervisor'])).optional(),
});
exports.userQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).optional(),
    pageSize: zod_1.z.coerce.number().min(1).max(100).optional(),
    role: zod_1.z.enum(['engineer', 'manager', 'admin', 'supervisor']).optional(),
    email: zod_1.z.string().optional(),
});
//# sourceMappingURL=user-schemas.js.map