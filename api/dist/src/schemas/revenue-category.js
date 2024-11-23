"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRevenueCategorySchema = exports.CreateRevenueCategorySchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.CreateRevenueCategorySchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    teamId: joi_1.default.string().required(),
});
exports.UpdateRevenueCategorySchema = joi_1.default.object({
    name: joi_1.default.string(),
    teamId: joi_1.default.string(),
});
