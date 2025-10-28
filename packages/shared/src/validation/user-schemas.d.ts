import { z } from 'zod';
export declare const userRegistrationSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
}, {
    name: string;
    email: string;
    password: string;
}>;
export declare const userLoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const userProfileUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    roles: z.ZodOptional<z.ZodArray<z.ZodEnum<["engineer", "manager", "admin", "supervisor"]>, "many">>;
}, "strip", z.ZodTypeAny, {
    roles?: ("engineer" | "manager" | "admin" | "supervisor")[] | undefined;
    name?: string | undefined;
}, {
    roles?: ("engineer" | "manager" | "admin" | "supervisor")[] | undefined;
    name?: string | undefined;
}>;
export declare const userQuerySchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodNumber>;
    pageSize: z.ZodOptional<z.ZodNumber>;
    role: z.ZodOptional<z.ZodEnum<["engineer", "manager", "admin", "supervisor"]>>;
    email: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    page?: number | undefined;
    pageSize?: number | undefined;
    role?: "engineer" | "manager" | "admin" | "supervisor" | undefined;
}, {
    email?: string | undefined;
    page?: number | undefined;
    pageSize?: number | undefined;
    role?: "engineer" | "manager" | "admin" | "supervisor" | undefined;
}>;
