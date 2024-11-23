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
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const handleError_1 = require("../utils/handleError");
const user_1 = require("../model/user");
const jwt_1 = require("../services/jwt");
class User {
    constructor() { }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.UserModel.create(req.body);
                const token = (0, jwt_1.generateToken)({ userId: user.id });
                res.setHeader("Authorization", `Bearer ${token}`);
                res.status(201).json(user);
            }
            catch (error) {
                return (0, handleError_1.handleError)(error, res, "User.post");
            }
        });
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.status(200).json(req.user);
            }
            catch (error) {
                return (0, handleError_1.handleError)(error, res, "User.get");
            }
        });
    }
}
exports.User = User;