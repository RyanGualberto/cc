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
exports.teamInvite = void 0;
const faker_1 = require("@faker-js/faker");
const team_1 = require("../../src/model/team");
const user_1 = require("./user");
const team_2 = require("./team");
const teamInvite = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = (data === null || data === void 0 ? void 0 : data.userId) || (yield (0, user_1.user)()).id;
    const teamId = (data === null || data === void 0 ? void 0 : data.teamId) || (yield (0, team_2.team)({ userId })).id;
    const teamInvite = {
        email: (data === null || data === void 0 ? void 0 : data.email) || faker_1.faker.internet.email(),
        userId,
        teamId,
    };
    return yield team_1.TeamModel.inviteTeamMembers(teamInvite);
});
exports.teamInvite = teamInvite;
