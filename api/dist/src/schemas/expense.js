"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateExpenseSchema = exports.CreateExpenseSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.CreateExpenseSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    description: joi_1.default.string().optional(),
    date: joi_1.default.date().required(),
    // monthly, weekly, daily or once
    recurrence: joi_1.default.string()
        .valid("monthly", "weekly", "daily", "once")
        .required(),
    until: joi_1.default.date(),
    amountInCents: joi_1.default.number().required(),
    userId: joi_1.default.string().required(),
    teamId: joi_1.default.string().required(),
    status: joi_1.default.string().valid("pending", "paid", "overdue"),
    categoryId: joi_1.default.string().required(),
});
exports.UpdateExpenseSchema = joi_1.default.object({
    title: joi_1.default.string(),
    description: joi_1.default.string().optional(),
    date: joi_1.default.date(),
    // monthly, weekly, daily or once
    recurrence: joi_1.default.string().valid("monthly", "weekly", "daily", "once"),
    status: joi_1.default.string().valid("pending", "paid", "overdue").required(),
    until: joi_1.default.date(),
    amountInCents: joi_1.default.number(),
    includeFuture: joi_1.default.boolean(),
    categoryId: joi_1.default.string(),
});
