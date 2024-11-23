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
exports.TeamModel = void 0;
const prismaClient_1 = __importDefault(require("../clients/prismaClient"));
const appError_1 = require("../utils/appError");
const team_1 = require("../schemas/team");
const team_2 = require("../serializers/team");
class TeamModel {
    constructor() { }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            team_1.CreateTeamSchema.validate(data);
            const team = yield prismaClient_1.default.team.create({
                data: {
                    name: data.name,
                    teamMembers: {
                        create: {
                            userId: data.userId,
                            role: "OWNER",
                        },
                    },
                },
                select: team_2.teamSerializer,
            });
            return team;
        });
    }
    findUserTeams(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const teams = yield prismaClient_1.default.team.findMany({
                where: {
                    teamMembers: {
                        some: {
                            userId,
                        },
                    },
                },
                select: team_2.teamSerializer,
            });
            const teamsWithCurrentRole = teams.map((team) => {
                const currentTeamMember = team.teamMembers.find((member) => member.userId === userId);
                return Object.assign(Object.assign({}, team), { role: currentTeamMember === null || currentTeamMember === void 0 ? void 0 : currentTeamMember.role });
            });
            const teamsWithBalanceAndQtTransactions = yield Promise.all(teamsWithCurrentRole.map((team) => __awaiter(this, void 0, void 0, function* () {
                const { balance, qtTransactions } = yield this.calculateTeamBalanceAndQtTransactions(team.id);
                return Object.assign(Object.assign({}, team), { balance,
                    qtTransactions });
            })));
            return teamsWithBalanceAndQtTransactions;
        });
    }
    findTeam(userId, teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            const team = yield this.findTeamAndValidatingUser(teamId, userId);
            const currentTeamMember = team.teamMembers.find((member) => member.userId === userId);
            return Object.assign(Object.assign({}, team), { role: currentTeamMember === null || currentTeamMember === void 0 ? void 0 : currentTeamMember.role });
        });
    }
    listTeamInvites(userId, teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateTeamMemberRole(teamId, userId);
            const invites = yield prismaClient_1.default.teamInvite.findMany({
                where: {
                    teamId,
                },
            });
            return invites;
        });
    }
    findTeamByInviteCode(inviteId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prismaClient_1.default.user.findFirst({
                where: {
                    id: userId,
                },
            });
            if (!user) {
                throw new appError_1.AppError("User not found", 404);
            }
            const invite = yield prismaClient_1.default.teamInvite.findFirst({
                where: {
                    id: inviteId,
                    email: user.email.toLowerCase(),
                },
                select: {
                    team: true,
                },
            });
            if (!invite) {
                throw new appError_1.AppError("Invite not found or invalid", 404);
            }
            return invite.team;
        });
    }
    inviteTeamMembers(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateTeamMemberRole(data.teamId, data.userId);
            const invite = yield prismaClient_1.default.teamInvite.create({
                data: {
                    email: data.email.toLowerCase(),
                    teamId: data.teamId,
                },
                include: {
                    team: true,
                },
            });
            return invite;
        });
    }
    acceptInvite(userId, inviteId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userEmail = yield prismaClient_1.default.user.findFirst({
                where: {
                    id: userId,
                },
                select: {
                    email: true,
                },
            });
            if (!userEmail) {
                throw new appError_1.AppError("User not found", 404);
            }
            const invite = yield prismaClient_1.default.teamInvite.findFirst({
                where: {
                    id: inviteId,
                    email: userEmail.email.toLowerCase(),
                },
            });
            if (!invite) {
                throw new appError_1.AppError("Team invite not found", 404);
            }
            yield prismaClient_1.default.teamMember.create({
                data: {
                    userId,
                    teamId: invite.teamId,
                    role: "MEMBER",
                },
            });
            yield prismaClient_1.default.teamInvite.delete({
                where: {
                    id: inviteId,
                },
            });
            return invite;
        });
    }
    removeTeamInvite(userId, teamId, inviteId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateTeamMemberRole(teamId, userId);
            const invite = yield prismaClient_1.default.teamInvite.findFirst({
                where: {
                    id: inviteId,
                    teamId,
                },
            });
            if (!invite) {
                throw new appError_1.AppError("Invite not found", 404);
            }
            yield prismaClient_1.default.teamInvite.delete({
                where: {
                    id: inviteId,
                },
            });
            return;
        });
    }
    removeTeamMember(userId, teamMemberId, teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateTeamMemberRole(teamId, userId);
            const teamMember = yield prismaClient_1.default.teamMember.findFirst({
                where: {
                    id: teamMemberId,
                    teamId,
                },
            });
            if ((teamMember === null || teamMember === void 0 ? void 0 : teamMember.userId) === userId) {
                throw new appError_1.AppError("You can't remove yourself from the team");
            }
            if (!teamMember) {
                throw new appError_1.AppError("Team member not found", 404);
            }
            yield prismaClient_1.default.teamMember.delete({
                where: {
                    id: teamMemberId,
                },
            });
            return;
        });
    }
    updateMemberRole(userId, teamMemberId, teamId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateTeamMemberRole(teamId, userId);
            if (!["OWNER", "ADMIN", "MEMBER"].includes(role)) {
                throw new appError_1.AppError("Invalid role", 400);
            }
            const teamMember = yield prismaClient_1.default.teamMember.findFirst({
                where: {
                    id: teamMemberId,
                },
            });
            if (!teamMember) {
                throw new appError_1.AppError("Team member not found", 404);
            }
            yield prismaClient_1.default.teamMember.update({
                where: {
                    id: teamMemberId,
                },
                data: {
                    role,
                },
            });
            return teamMember;
        });
    }
    findTeamAndValidatingUser(teamId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const team = yield prismaClient_1.default.team.findFirst({
                where: {
                    id: teamId,
                    teamMembers: {
                        some: {
                            userId,
                        },
                    },
                },
                select: team_2.teamSerializer,
            });
            if (!team) {
                throw new appError_1.AppError("Team not found", 404);
            }
            return team;
        });
    }
    updateTeam(userId, teamId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.name) {
                throw new appError_1.AppError("Name is required", 400);
            }
            const team = yield this.findTeamAndValidatingUser(teamId, userId);
            yield this.validateTeamMemberRole(teamId, userId);
            if (data.name) {
                yield prismaClient_1.default.team.update({
                    where: {
                        id: teamId,
                    },
                    data: {
                        name: data.name,
                    },
                });
            }
            return team;
        });
    }
    deleteTeam(userId, teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateTeamMemberRole(teamId, userId);
            yield prismaClient_1.default.team.delete({
                where: {
                    id: teamId,
                },
            });
            return;
        });
    }
    calculateTeamBalanceAndQtTransactions(teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const teamExpensesInCurrentYearAndMonth = yield prismaClient_1.default.expense.aggregate({
                where: {
                    teamId,
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                        lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
                    },
                },
                _sum: {
                    amountInCents: true,
                },
                _count: true,
            });
            const teamRevenuesInCurrentYearAndMonth = yield prismaClient_1.default.revenue.aggregate({
                where: {
                    teamId,
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                        lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
                    },
                },
                _sum: {
                    amountInCents: true,
                },
                _count: true,
            });
            return {
                balance: (((_a = teamRevenuesInCurrentYearAndMonth._sum) === null || _a === void 0 ? void 0 : _a.amountInCents) || 0) -
                    (((_b = teamExpensesInCurrentYearAndMonth._sum) === null || _b === void 0 ? void 0 : _b.amountInCents) || 0),
                qtTransactions: teamExpensesInCurrentYearAndMonth._count +
                    teamRevenuesInCurrentYearAndMonth._count,
            };
        });
    }
    validateTeamMemberRole(teamId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const team = yield this.findTeamAndValidatingUser(teamId, userId);
            const currentTeamMember = team.teamMembers.find((member) => member.userId === userId);
            if (!currentTeamMember ||
                (currentTeamMember.role !== "OWNER" && currentTeamMember.role !== "ADMIN")) {
                throw new appError_1.AppError("You don't have permission to invite team members", 403);
            }
        });
    }
}
const model = new TeamModel();
exports.TeamModel = model;
