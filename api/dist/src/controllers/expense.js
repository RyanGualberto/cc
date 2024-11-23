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
exports.Expense = void 0;
const handleError_1 = require("../utils/handleError");
const expense_1 = require("../model/expense");
class Expense {
    constructor() { }
    listTeamExpenses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const expenses = yield expense_1.ExpenseModel.listTeamExpenses(req.user.id, req.params.teamId, req.query);
                res.status(200).json(expenses);
            }
            catch (error) {
                return (0, handleError_1.handleError)(error, res, "Expense.listTeamExpenses");
            }
        });
    }
    createTeamExpense(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.body.userId = req.user.id;
                const expense = yield expense_1.ExpenseModel.create(req.body);
                res.status(201).json(expense);
            }
            catch (error) {
                return (0, handleError_1.handleError)(error, res, "Expense.createTeamExpense");
            }
        });
    }
    updateTeamExpense(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const expense = yield expense_1.ExpenseModel.update(req.params.id, req.params.teamId, req.body);
                res.status(200).json(expense);
            }
            catch (error) {
                return (0, handleError_1.handleError)(error, res, "Expense.updateTeamExpense");
            }
        });
    }
    deleteTeamExpense(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield expense_1.ExpenseModel.delete(req.params.id, req.user.id, req.params.teamId);
                res.status(204).end();
            }
            catch (error) {
                return (0, handleError_1.handleError)(error, res, "Expense.deleteTeamExpense");
            }
        });
    }
    deleteTeamExpensesByBatch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield expense_1.ExpenseModel.deleteByBatch(req.params.batchId, req.user.id, req.params.teamId);
                res.status(204).end();
            }
            catch (error) {
                return (0, handleError_1.handleError)(error, res, "Expense.deleteTeamExpensesByBatch");
            }
        });
    }
}
exports.Expense = Expense;
