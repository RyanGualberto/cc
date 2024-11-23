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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevenueModel = void 0;
const prismaClient_1 = __importDefault(require("../clients/prismaClient"));
const revenue_1 = require("../schemas/revenue");
const revenue_2 = require("../serializers/revenue");
const appError_1 = require("../utils/appError");
const team_1 = require("./team");
const uuid_1 = require("uuid");
class RevenueModel {
    constructor() { }
    listTeamRevenues(userId, teamId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            yield team_1.TeamModel.findTeamAndValidatingUser(teamId, userId);
            const { date, // MM/YYYY
             } = query;
            const [month, year] = String(date).split("/");
            const startDate = new Date(`${year}-${month}-01`);
            const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));
            const revenues = yield prismaClient_1.default.revenue.findMany({
                where: {
                    AND: [
                        {
                            teamId,
                            date: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    ],
                },
                select: revenue_2.revenueSerializer,
            });
            return revenues;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error, value } = revenue_1.CreateRevenueSchema.validate(data);
            yield team_1.TeamModel.findTeamAndValidatingUser(data.teamId, data.userId);
            if (error) {
                throw new appError_1.AppError(error.message, 400);
            }
            if (value.recurrence !== "once" && !value.until) {
                throw new appError_1.AppError("Until date is required for recurring revenues");
            }
            if (value.recurrence === "once" && value.until) {
                throw new appError_1.AppError("Until date is not required for one-time revenues");
            }
            if (value.recurrence === "once") {
                const revenue = yield prismaClient_1.default.revenue.create({
                    data: value,
                    select: revenue_2.revenueSerializer,
                });
                return revenue;
            }
            const batch = (0, uuid_1.v4)();
            const revenues = yield prismaClient_1.default.revenue.createMany({
                data: Array.from({
                    length: Math.ceil((value.until.getTime() - value.date.getTime()) / 2628000000),
                }, (_, index) => (Object.assign(Object.assign({}, value), { date: new Date(value.date.getTime() + index * 2628000000), batch: batch }))),
            });
            return revenues;
        });
    }
    findRevenueById(revenueId, userId, teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield team_1.TeamModel.findTeamAndValidatingUser(teamId, userId);
            const revenue = yield prismaClient_1.default.revenue.findFirst({
                where: {
                    id: revenueId,
                    teamId,
                },
                select: revenue_2.revenueSerializer,
            });
            if (!revenue) {
                throw new appError_1.AppError("Revenue not found", 404);
            }
            return revenue;
        });
    }
    update(id, teamId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error, value } = revenue_1.UpdateRevenueSchema.validate(data);
            if (error) {
                throw new appError_1.AppError(error.message, 400);
            }
            const { includeFuture, date } = value, payload = __rest(value, ["includeFuture", "date"]);
            if (!includeFuture) {
                yield this.findRevenueById(id, data.userId, teamId);
                return yield prismaClient_1.default.revenue.update({
                    where: {
                        id,
                    },
                    data: Object.assign(Object.assign({}, payload), { date: date }),
                    select: revenue_2.revenueSerializer,
                });
            }
            yield team_1.TeamModel.findTeamAndValidatingUser(teamId, data.userId);
            return yield prismaClient_1.default.revenue.updateMany({
                where: {
                    batch: id,
                },
                data: payload,
            });
        });
    }
    delete(id, userId, teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.findRevenueById(id, userId, teamId);
            return yield prismaClient_1.default.revenue.delete({
                where: {
                    id,
                },
            });
        });
    }
    deleteByBatch(id, userId, teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield team_1.TeamModel.findTeamAndValidatingUser(teamId, userId);
            const revenues = yield prismaClient_1.default.revenue.findMany({
                where: {
                    batch: id,
                },
            });
            if (!revenues.length) {
                throw new appError_1.AppError("Batch not found", 404);
            }
            return yield prismaClient_1.default.revenue.deleteMany({
                where: {
                    batch: id,
                },
            });
        });
    }
}
const model = new RevenueModel();
exports.RevenueModel = model;
