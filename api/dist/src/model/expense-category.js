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
exports.ExpenseCategoryModel = void 0;
const prismaClient_1 = __importDefault(require("../clients/prismaClient"));
const expense_category_1 = require("../schemas/expense-category");
const appError_1 = require("../utils/appError");
const team_1 = require("./team");
class ExpenseCategoryModel {
    constructor() { }
    listTeamExpenseCategories(teamId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield team_1.TeamModel.findTeamAndValidatingUser(teamId, userId);
            return yield prismaClient_1.default.expenseCategory.findMany({
                where: {
                    teamId,
                },
                include: {
                    _count: {
                        select: {
                            expenses: true,
                        },
                    },
                },
            });
        });
    }
    create(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error, value } = expense_category_1.CreateExpenseCategorySchema.validate(data);
            yield team_1.TeamModel.findTeamAndValidatingUser(data.teamId, userId);
            if (error) {
                throw new appError_1.AppError(error.message, 400);
            }
            return yield prismaClient_1.default.expenseCategory.create({
                data: value,
            });
        });
    }
    update(id, userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield team_1.TeamModel.findTeamAndValidatingUser(data.teamId, userId);
            return yield prismaClient_1.default.expenseCategory.update({
                where: {
                    id,
                },
                data: {
                    name: data.name,
                },
            });
        });
    }
}
const model = new ExpenseCategoryModel();
exports.ExpenseCategoryModel = model;
