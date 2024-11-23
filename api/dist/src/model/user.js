"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const prismaClient_1 = __importDefault(require("../clients/prismaClient"));
const appError_1 = require("../utils/appError");
const user_1 = require("../serializers/user");
const user_2 = require("../schemas/user");
class UserModel {
    constructor() { }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { value, error } = user_2.CreateUserSchema.validate(data);
            if (error) {
                throw new appError_1.AppError(error.message, 400);
            }
            value.cpf = this.sanitizeCPF(value.cpf);
            value.phone = this.sanitizePhone(value.phone);
            value.email = this.sanitizeEmail(value.email);
            const user = yield prismaClient_1.default.user.create({
                data: value,
                select: user_1.userSerializer,
            });
            return user;
        });
    }
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error, value } = user_2.UserLoginSchema.validate(data);
            if (error) {
                throw new appError_1.AppError(error.message, 400);
            }
            if (value.cpf) {
                value.cpf = this.sanitizeCPF(value.cpf);
            }
            if (value.phone) {
                value.phone = this.sanitizePhone(value.phone);
            }
            if (value.email) {
                value.email = this.sanitizeEmail(value.email);
            }
            const user = yield prismaClient_1.default.user.findFirst({
                where: {
                    OR: [
                        { email: value.email },
                        { phone: value.phone },
                        { cpf: value.cpf },
                    ],
                    password: value.password,
                },
                select: user_1.userSerializer,
            });
            if (!user) {
                throw new appError_1.AppError("User not found", 404);
            }
            return user;
        });
    }
    findUnique(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prismaClient_1.default.user.findUnique({
                where: {
                    id,
                },
                select: user_1.userSerializer,
            });
            if (!user) {
                throw new appError_1.AppError("User not found", 404);
            }
            return user;
        });
    }
    sanitizeCPF(cpf) {
        return cpf.replace(/\D/g, "");
    }
    sanitizePhone(phone) {
        return phone.replace(/\D/g, "");
    }
    sanitizeEmail(email) {
        return email.toLowerCase();
    }
}
const model = new UserModel();
exports.UserModel = model;
