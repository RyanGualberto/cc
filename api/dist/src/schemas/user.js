"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLoginSchema = exports.CreateUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.CreateUserSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
    first_name: joi_1.default.string().required(),
    last_name: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
    cpf: joi_1.default.string().required(),
});
exports.UserLoginSchema = joi_1.default.object({
    email: joi_1.default.string().email(),
    phone: joi_1.default.string(),
    cpf: joi_1.default.string(),
    password: joi_1.default.string().required(),
});
