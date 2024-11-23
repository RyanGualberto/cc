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
exports.ExpenseCategory = void 0;
const handleError_1 = require("../utils/handleError");
const expense_category_1 = require("../model/expense-category");
class ExpenseCategory {
    constructor() { }
    listTeamExpenseCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const expenses = yield expense_category_1.ExpenseCategoryModel.listTeamExpenseCategories(req.params.teamId, req.user.id);
                res.status(200).json(expenses);
            }
            catch (error) {
                return (0, handleError_1.handleError)(error, res, "ExpenseCategory.listTeamExpenseCategories");
            }
        });
    }
    createTeamExpenseCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const expense = yield expense_category_1.ExpenseCategoryModel.create(req.user.id, req.body);
                res.status(201).json(expense);
            }
            catch (error) {
                return (0, handleError_1.handleError)(error, res, "ExpenseCategory.createTeamExpenseCategories");
            }
        });
    }
    updateTeamExpenseCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const expense = yield expense_category_1.ExpenseCategoryModel.update(req.params.id, req.user.id, req.body);
                res.status(200).json(expense);
            }
            catch (error) {
                return (0, handleError_1.handleError)(error, res, "ExpenseCategory.updateTeamExpenseCategories");
            }
        });
    }
}
exports.ExpenseCategory = ExpenseCategory;
