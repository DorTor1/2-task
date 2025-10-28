"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPaginationResult = exports.getPaginationParams = void 0;
const getPaginationParams = ({ page = 1, pageSize = 20 }) => {
    const currentPage = Math.max(1, Number(page));
    const limit = Math.min(100, Math.max(1, Number(pageSize)));
    const offset = (currentPage - 1) * limit;
    return { limit, offset, page: currentPage, pageSize: limit };
};
exports.getPaginationParams = getPaginationParams;
const buildPaginationResult = (items, total, page, pageSize) => ({
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
});
exports.buildPaginationResult = buildPaginationResult;
//# sourceMappingURL=pagination.js.map