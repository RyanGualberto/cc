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
exports.authenticator = void 0;
const jwt_1 = require("../services/jwt");
const user_1 = require("../model/user");
function authenticator(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        try {
            const { userId } = (0, jwt_1.decodeTokenFromHeader)(authorization);
            const user = yield user_1.UserModel.findUnique(userId);
            req.user = user;
            next();
        }
        catch (error) {
            return res.status(401).json({ message: "Unauthorized" });
        }
    });
}
exports.authenticator = authenticator;
