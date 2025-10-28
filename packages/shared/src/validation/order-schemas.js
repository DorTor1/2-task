"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderQuerySchema = exports.orderUpdateStatusSchema = exports.orderCreateSchema = void 0;
const zod_1 = require("zod");
const orderItemSchema = zod_1.z.object({
    productId: zod_1.z.string(),
    name: zod_1.z.string(),
    quantity: zod_1.z.number().int().positive(),
    price: zod_1.z.number().nonnegative(),
});
exports.orderCreateSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid().optional(),
    items: zod_1.z.array(orderItemSchema).min(1),
});
exports.orderUpdateStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['created', 'in_progress', 'completed', 'cancelled']),
});
exports.orderQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).optional(),
    pageSize: zod_1.z.coerce.number().min(1).max(100).optional(),
    status: zod_1.z.enum(['created', 'in_progress', 'completed', 'cancelled']).optional(),
    sort: zod_1.z.enum(['createdAt', 'status']).optional(),
    direction: zod_1.z.enum(['asc', 'desc']).optional(),
});
//# sourceMappingURL=order-schemas.js.map