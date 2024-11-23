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
exports.RevenueCategoryModel = void 0;
const prismaClient_1 = __importDefault(require("../clients/prismaClient"));
const revenue_category_1 = require("../schemas/revenue-category");
const appError_1 = require("../utils/appError");
const team_1 = require("./team");
class RevenueCategoryModel {
    constructor() { }
    listTeamRevenueCategories(teamId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield team_1.TeamModel.findTeamAndValidatingUser(teamId, userId);
            return yield prismaClient_1.default.revenueCategory.findMany({
                where: {
                    teamId,
                },
                include: {
                    _count: {
                        select: {
                            revenues: true,
                        },
                    },
                },
            });
        });
    }
    create(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error, value } = revenue_category_1.CreateRevenueCategorySchema.validate(data);
            yield team_1.TeamModel.findTeamAndValidatingUser(data.teamId, userId);
            if (error) {
                throw new appError_1.AppError(error.message, 400);
            }
            return yield prismaClient_1.default.revenueCategory.create({
                data: value,
            });
        });
    }
    update(id, userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield team_1.TeamModel.findTeamAndValidatingUser(data.teamId, userId);
            return yield prismaClient_1.default.revenueCategory.update({
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
const model = new RevenueCategoryModel();
exports.RevenueCategoryModel = model;
