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
exports.RevenueCategory = void 0;
const handleError_1 = require("../utils/handleError");
const revenue_category_1 = require("../model/revenue-category");
class RevenueCategory {
    constructor() { }
    listTeamRevenueCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const revenues = yield revenue_category_1.RevenueCategoryModel.listTeamRevenueCategories(req.params.teamId, req.user.id);
                res.status(200).json(revenues);
            }
            catch (error) {
                return (0, handleError_1.handleError)(error, res, "RevenueCategory.listTeamRevenueCategories");
            }
        });
    }
    createTeamRevenueCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const revenue = yield revenue_category_1.RevenueCategoryModel.create(req.user.id, req.body);
                res.status(201).json(revenue);
            }
            catch (error) {
                return (0, handleError_1.handleError)(error, res, "RevenueCategory.createTeamRevenueCategories");
            }
        });
    }
    updateTeamRevenueCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const revenue = yield revenue_category_1.RevenueCategoryModel.update(req.params.id, req.user.id, req.body);
                res.status(200).json(revenue);
            }
            catch (error) {
                return (0, handleError_1.handleError)(error, res, "RevenueCategory.updateTeamRevenueCategories");
            }
        });
    }
}
exports.RevenueCategory = RevenueCategory;
