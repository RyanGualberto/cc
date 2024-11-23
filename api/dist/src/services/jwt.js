"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeTokenFromHeader = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = `${process.env.JWT_SECRET}`;
function generateToken(payload) {
    return jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn: 60 * 60,
    });
}
exports.generateToken = generateToken;
function decodeTokenFromHeader(fullToken) {
    const token = fullToken.split(" ")[1];
    const decoded = jsonwebtoken_1.default.decode(token);
    return decoded;
}
exports.decodeTokenFromHeader = decodeTokenFromHeader;
