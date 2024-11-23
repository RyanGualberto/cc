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
exports.Revenue = void 0;
const handleError_1 = require("../utils/handleError");
const revenue_1 = require("../model/revenue");
class Revenue {
    constructor() { }
    listTeamRevenues(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const revenues = yield revenue_1.RevenueModel.listTeamRevenues(req.user.id, req.params.teamId, req.query);
                res.status(200).json(revenues);
            }
            catch (error) {
                return (0, handleError_1.handleError)(error, res, "Revenue.listTeamRevenues");
            }
        });
    }
    createTeamRevenue(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.body.userId = req.user.id;
                const revenue = yield revenue_1.RevenueModel.create(req.body);
                res.status(201).json(revenue);
            }
            catch (error) {
                return (0, handleError_1.handleError)(error, res, "Revenue.createTeamRevenue");
            }
        });
    }
    updateTeamRevenue(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const revenue = yield revenue_1.RevenueModel.update(req.params.id, req.params.teamId, req.body);
                res.status(200).json(revenue);
            }
            catch (error) {
                return (0, handleError_1.handleError)(error, res, "Revenue.updateTeamRevenue");
            }
        });
    }
    deleteTeamRevenue(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield revenue_1.RevenueModel.delete(req.params.id, req.user.id, req.params.teamId);
                res.status(204).end();
            }
            catch (error) {
                return (0, handleError_1.handleError)(error, res, "Revenue.deleteTeamRevenue");
            }
        });
    }
    deleteTeamRevenuesByBatch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield revenue_1.RevenueModel.deleteByBatch(req.params.batchId, req.user.id, req.params.teamId);
                res.status(204).end();
            }
            catch (error) {
                return (0, handleError_1.handleError)(error, res, "Revenue.deleteTeamRevenuesByBatch");
            }
        });
    }
}
exports.Revenue = Revenue;
