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
exports.db = exports.reset = exports.updateSchema = void 0;
const prismaClient_1 = __importDefault(require("../../src/clients/prismaClient"));
const exec_1 = require("./exec");
const tableNames = [
    "team_invites",
    "expenses",
    "team_members",
    "teams",
    "users",
];
function updateSchema() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, exec_1.runCommand)("npx prisma db push --accept-data-loss");
    });
}
exports.updateSchema = updateSchema;
function reset() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const tableName of tableNames) {
            yield prismaClient_1.default.$queryRawUnsafe(`TRUNCATE TABLE "${tableName}" CASCADE;`);
        }
        return true;
    });
}
exports.reset = reset;
exports.db = {
    reset,
    updateSchema,
};
