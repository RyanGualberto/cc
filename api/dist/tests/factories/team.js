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
exports.team = void 0;
const faker_1 = require("@faker-js/faker");
const team_1 = require("../../src/model/team");
const user_1 = require("./user");
const team = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const team = {
        name: (data === null || data === void 0 ? void 0 : data.name) || faker_1.faker.company.name(),
        userId: (data === null || data === void 0 ? void 0 : data.userId) || (yield (0, user_1.user)()).id,
    };
    return yield team_1.TeamModel.create(team);
});
exports.team = team;
