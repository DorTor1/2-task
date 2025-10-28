import { z } from 'zod';
export declare const orderCreateSchema: z.ZodObject<{
    userId: z.ZodOptional<z.ZodString>;
    items: z.ZodArray<z.ZodObject<{
        productId: z.ZodString;
        name: z.ZodString;
        quantity: z.ZodNumber;
        price: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        name: string;
        productId: string;
        quantity: number;
        price: number;
    }, {
        name: string;
        productId: string;
        quantity: number;
        price: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    items: {
        name: string;
        productId: string;
        quantity: number;
        price: number;
    }[];
    userId?: string | undefined;
}, {
    items: {
        name: string;
        productId: string;
        quantity: number;
        price: number;
    }[];
    userId?: string | undefined;
}>;
export declare const orderUpdateStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["created", "in_progress", "completed", "cancelled"]>;
}, "strip", z.ZodTypeAny, {
    status: "created" | "in_progress" | "completed" | "cancelled";
}, {
    status: "created" | "in_progress" | "completed" | "cancelled";
}>;
export declare const orderQuerySchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodNumber>;
    pageSize: z.ZodOptional<z.ZodNumber>;
    status: z.ZodOptional<z.ZodEnum<["created", "in_progress", "completed", "cancelled"]>>;
    sort: z.ZodOptional<z.ZodEnum<["createdAt", "status"]>>;
    direction: z.ZodOptional<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    sort?: "status" | "createdAt" | undefined;
    page?: number | undefined;
    pageSize?: number | undefined;
    status?: "created" | "in_progress" | "completed" | "cancelled" | undefined;
    direction?: "asc" | "desc" | undefined;
}, {
    sort?: "status" | "createdAt" | undefined;
    page?: number | undefined;
    pageSize?: number | undefined;
    status?: "created" | "in_progress" | "completed" | "cancelled" | undefined;
    direction?: "asc" | "desc" | undefined;
}>;
