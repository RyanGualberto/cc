"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseSerializer = void 0;
const user_1 = require("./user");
exports.expenseSerializer = {
    id: true,
    title: true,
    description: true,
    amountInCents: true,
    recurrence: true,
    status: true,
    date: true,
    batch: true,
    user: {
        select: user_1.userSerializer,
    },
    category: true,
    until: true,
};
