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
exports.teamMember = void 0;
const user_1 = require("./user");
const team_1 = require("./team");
const prismaClient_1 = __importDefault(require("../../src/clients/prismaClient"));
const teamMember = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = (data === null || data === void 0 ? void 0 : data.userId) || (yield (0, user_1.user)()).id;
    const teamId = (data === null || data === void 0 ? void 0 : data.teamId) || (yield (0, team_1.team)({ userId })).id;
    const teamMember = {
        userId,
        teamId,
        role: (data === null || data === void 0 ? void 0 : data.role) || "MEMBER",
    };
    return yield prismaClient_1.default.teamMember.create({
        data: teamMember,
    });
});
exports.teamMember = teamMember;
