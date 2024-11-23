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
const supertest_1 = __importDefault(require("supertest"));
const faker_1 = require("@faker-js/faker");
const app_1 = __importDefault(require("../../src/app"));
const db_1 = require("../helpers/db");
const user_1 = require("../factories/user");
const team_1 = require("../factories/team");
const jwt_1 = require("../../src/services/jwt");
const team_invite_1 = require("../factories/team-invite");
const team_member_1 = require("../factories/team-member");
describe("Team Test", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.updateSchema();
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.reset();
    }));
    test("should create a team", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user1.id,
        });
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/teams")
            .send({
            name: faker_1.faker.company.name(),
        })
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 201) {
            console.log(response.body);
        }
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("name");
        expect(response.body).toHaveProperty("teamMembers");
        expect(response.body).toHaveProperty("role");
        expect(response.body.teamMembers).toHaveLength(1);
    }));
    test("should return an error due to no has token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post("/teams").send({
            name: faker_1.faker.company.name(),
        });
        if (response.status !== 401) {
            console.log(response.body);
        }
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to token is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/teams")
            .send({
            name: faker_1.faker.company.name(),
        })
            .set("authorization", `Bearer invalid-token`);
        if (response.status !== 401) {
            console.log(response.body);
        }
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to no has name on body", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user1.id,
        });
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/teams")
            .send()
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 400) {
            console.log(response.body);
        }
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return just teams from current user", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user1.id,
        });
        const team1 = yield (0, team_1.team)({ userId: user1.id });
        yield (0, team_1.team)();
        const response = yield (0, supertest_1.default)(app_1.default)
            .get("/teams")
            .send()
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 200) {
            console.log(response.body);
        }
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0]).toMatchObject({
            id: team1.id,
            name: team1.name,
        });
    }));
    test("should return an error due to no has token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get("/teams").send();
        if (response.status !== 401) {
            console.log(response.body);
        }
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to token is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get("/teams")
            .send()
            .set("authorization", `Bearer invalid-token`);
        if (response.status !== 401) {
            console.log(response.body);
        }
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return team by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user1.id,
        });
        const team1 = yield (0, team_1.team)({ userId: user1.id });
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/teams/${team1.id}`)
            .send()
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 200) {
            console.log(response.body);
        }
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("name");
        expect(response.body).toHaveProperty("teamMembers");
        expect(response.body).toHaveProperty("role");
    }));
    test("should return an error due to no has token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get("/teams/team-id").send();
        if (response.status !== 401) {
            console.log(response.body);
        }
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to token is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get("/teams/team-id")
            .send()
            .set("authorization", `Bearer invalid-token`);
        if (response.status !== 401) {
            console.log(response.body);
        }
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to not found team", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user1.id,
        });
        const response = yield (0, supertest_1.default)(app_1.default)
            .get("/teams/invalid-team-id")
            .send()
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 404) {
            console.log(response.body);
        }
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to user no is part from team", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user1.id,
        });
        const team1 = yield (0, team_1.team)();
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/teams/${team1.id}`)
            .send()
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 404) {
            console.log(response.body);
        }
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message");
    }));
    test("should create an invite to a team", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user1.id,
        });
        const team1 = yield (0, team_1.team)({ userId: user1.id });
        const email = faker_1.faker.internet.email();
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(`/teams/invites/create`)
            .send({
            email,
            teamId: team1.id,
        })
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 201) {
            console.log(response.body);
        }
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("inviteToken");
    }));
    test("should return an error due to no has token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post(`/teams/invites/create`);
        if (response.status !== 401) {
            console.log(response.body);
        }
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to token is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(`/teams/invites/create`)
            .set("authorization", `Bearer invalid-token`);
        if (response.status !== 401) {
            console.log(response.body);
        }
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to no has email", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user1.id,
        });
        const team1 = yield (0, team_1.team)({ userId: user1.id });
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(`/teams/invites/create`)
            .send({
            teamId: team1.id,
        })
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 400) {
            console.log(response.body);
        }
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to no has teamId", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user1.id,
        });
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(`/teams/invites/create`)
            .send({
            email: faker_1.faker.internet.email(),
        })
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 404) {
            console.log(response.body);
        }
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to not found team", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user1.id,
        });
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(`/teams/invites/create`)
            .send({
            email: faker_1.faker.internet.email(),
            teamId: "invalid-team-id",
        })
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 404) {
            console.log(response.body);
        }
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to invite already exists", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user1.id,
        });
        const invite = yield (0, team_invite_1.teamInvite)({ userId: user1.id });
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(`/teams/invites/create`)
            .send({
            email: invite.email,
            teamId: invite.teamId,
        })
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 400) {
            console.log(response.body);
        }
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to user don't have permission to invite to team", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const user2 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user2.id,
        });
        const team1 = yield (0, team_1.team)({ userId: user1.id });
        yield (0, team_member_1.teamMember)({ teamId: team1.id, userId: user2.id, role: "MEMBER" });
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(`/teams/invites/create`)
            .send({
            email: faker_1.faker.internet.email(),
            teamId: team1.id,
        })
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 403) {
            console.log(response.body);
        }
        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty("message");
    }));
    test("should accept an invite to a team", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user1.id,
        });
        const invite = yield (0, team_invite_1.teamInvite)({ email: user1.email });
        const inviteToken = (0, jwt_1.generateToken)({ inviteId: invite.id });
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(`/teams/invites/accept?token=${inviteToken}`)
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 200) {
            console.log(response.body);
        }
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id: invite.id,
            teamId: invite.teamId,
            email: invite.email,
            createdAt: invite.createdAt.toISOString(),
            updatedAt: invite.updatedAt.toISOString(),
        });
    }));
    test("should return an error due to no has token", () => __awaiter(void 0, void 0, void 0, function* () {
        const invite = yield (0, team_invite_1.teamInvite)();
        const inviteToken = (0, jwt_1.generateToken)({ inviteId: invite.id });
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(`/teams/invites/accept?token=${inviteToken}`)
            .send({
            email: invite.email,
        });
        if (response.status !== 401) {
            console.log(response.body);
        }
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to token is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const invite = yield (0, team_invite_1.teamInvite)();
        const inviteToken = (0, jwt_1.generateToken)({ inviteId: invite.id });
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(`/teams/invites/accept?token=${inviteToken}`)
            .send({
            email: invite.email,
        })
            .set("authorization", `Bearer invalid-token`);
        if (response.status !== 401) {
            console.log(response.body);
        }
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to no has invite token", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user1.id,
        });
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(`/teams/invites/accept`)
            .send({
            email: user1.email,
        })
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 400) {
            console.log(response.body);
        }
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to no has email", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user1.id,
        });
        const invite = yield (0, team_invite_1.teamInvite)();
        const inviteToken = (0, jwt_1.generateToken)({ inviteId: invite.id });
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(`/teams/invites/accept?token=${inviteToken}`)
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 404) {
            console.log(response.body);
        }
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message");
    }));
    test("should remove a team member", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user1.id,
        });
        const team1 = yield (0, team_1.team)({ userId: user1.id });
        const teamMember1 = yield (0, team_member_1.teamMember)({ teamId: team1.id });
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/teams/${team1.id}/members/${teamMember1.id}`)
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 204) {
            console.log(response.body);
        }
        expect(response.status).toBe(204);
    }));
    test("should return an error due to no has token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).delete(`/teams/team-id/members/member-id`);
        if (response.status !== 401) {
            console.log(response.body);
        }
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to token is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/teams/team-id/members/member-id`)
            .set("authorization", `Bearer invalid-token`);
        if (response.status !== 401) {
            console.log(response.body);
        }
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to team member not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user1.id,
        });
        const team1 = yield (0, team_1.team)({ userId: user1.id });
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/teams/${team1.id}/members/invalid-member-id`)
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 404) {
            console.log(response.body);
        }
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to user can't remove yourself from the team", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user1.id,
        });
        const team1 = yield (0, team_1.team)({ userId: user1.id });
        const teamMember1 = yield (0, team_member_1.teamMember)({
            teamId: team1.id,
            userId: user1.id,
        });
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/teams/${team1.id}/members/${teamMember1.id}`)
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 400) {
            console.log(response.body);
        }
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to user don't have permission to remove team member", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const user2 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user2.id,
        });
        const team1 = yield (0, team_1.team)({ userId: user1.id });
        const teamMember1 = yield (0, team_member_1.teamMember)({ teamId: team1.id });
        yield (0, team_member_1.teamMember)({ teamId: team1.id, userId: user2.id, role: "MEMBER" });
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/teams/${team1.id}/members/${teamMember1.id}`)
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 403) {
            console.log(response.body);
        }
        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to current user not is part from team", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user1.id,
        });
        const teamMember1 = yield (0, team_member_1.teamMember)();
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/teams/${teamMember1.teamId}/members/${teamMember1.id}`)
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 404) {
            console.log(response.body);
        }
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message");
    }));
    test("should update a team member role", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user1.id,
        });
        const team1 = yield (0, team_1.team)({ userId: user1.id });
        const teamMember1 = yield (0, team_member_1.teamMember)({ teamId: team1.id });
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/teams/${team1.id}/members/${teamMember1.id}`)
            .send({
            role: "ADMIN",
        })
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 200) {
            console.log(response.body);
        }
        expect(response.status).toBe(200);
    }));
    test("should return an error due to no has token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).put(`/teams/team-id/members/member-id`);
        if (response.status !== 401) {
            console.log(response.body);
        }
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to token is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/teams/team-id/members/member-id`)
            .set("authorization", `Bearer invalid-token`);
        if (response.status !== 401) {
            console.log(response.body);
        }
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to no has role on body", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user1.id,
        });
        const team1 = yield (0, team_1.team)({ userId: user1.id });
        const teamMember1 = yield (0, team_member_1.teamMember)({ teamId: team1.id });
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/teams/${team1.id}/members/${teamMember1.id}`)
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 400) {
            console.log(response.body);
        }
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to team member not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user1.id,
        });
        const team1 = yield (0, team_1.team)({ userId: user1.id });
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/teams/${team1.id}/members/invalid-member-id`)
            .send({
            role: "ADMIN",
        })
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 404) {
            console.log(response.body);
        }
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to user don't have permission to update team member role", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const user2 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user2.id,
        });
        const team1 = yield (0, team_1.team)({ userId: user1.id });
        const teamMember1 = yield (0, team_member_1.teamMember)({ teamId: team1.id });
        yield (0, team_member_1.teamMember)({ teamId: team1.id, userId: user2.id, role: "MEMBER" });
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/teams/${team1.id}/members/${teamMember1.id}`)
            .send({
            role: "ADMIN",
        })
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 403) {
            console.log(response.body);
        }
        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to current user not is part from team", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user1.id,
        });
        const teamMember1 = yield (0, team_member_1.teamMember)();
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/teams/${teamMember1.teamId}/members/${teamMember1.id}`)
            .send({
            role: "ADMIN",
        })
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 404) {
            console.log(response.body);
        }
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message");
    }));
    test("should update a team", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user1.id,
        });
        const team1 = yield (0, team_1.team)({ userId: user1.id });
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/teams/${team1.id}`)
            .send({
            name: faker_1.faker.company.name(),
        })
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 200) {
            console.log(response.body);
        }
        expect(response.status).toBe(200);
    }));
    test("should return an error due to no has token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).put(`/teams/team-id`);
        if (response.status !== 401) {
            console.log(response.body);
        }
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to token is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/teams/team-id`)
            .set("authorization", `Bearer invalid-token`);
        if (response.status !== 401) {
            console.log(response.body);
        }
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to no has name on body", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user1.id,
        });
        const team1 = yield (0, team_1.team)({ userId: user1.id });
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/teams/${team1.id}`)
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 400) {
            console.log(response.body);
        }
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to team not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user1.id,
        });
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/teams/invalid-team-id`)
            .send({
            name: faker_1.faker.company.name(),
        })
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 404) {
            console.log(response.body);
        }
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to user don't have permission to update team", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const user2 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user2.id,
        });
        const team1 = yield (0, team_1.team)({ userId: user1.id });
        yield (0, team_member_1.teamMember)({ teamId: team1.id, userId: user2.id, role: "MEMBER" });
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/teams/${team1.id}`)
            .send({
            name: faker_1.faker.company.name() + " updated",
        })
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 403) {
            console.log("ERRO NO TESTE", team1.name, response.body.name);
        }
        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to current user not is part from team", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user1.id,
        });
        const team1 = yield (0, team_1.team)();
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/teams/${team1.id}`)
            .send({
            name: faker_1.faker.company.name(),
        })
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 404) {
            console.log(response.body);
        }
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message");
    }));
    test("should delete a team", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user1.id,
        });
        const team1 = yield (0, team_1.team)({ userId: user1.id });
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/teams/${team1.id}`)
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 204) {
            console.log(response.body);
        }
        expect(response.status).toBe(204);
    }));
    test("should return an error due to no has token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).delete(`/teams/team-id`);
        if (response.status !== 401) {
            console.log(response.body);
        }
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to token is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/teams/team-id`)
            .set("authorization", `Bearer invalid-token`);
        if (response.status !== 401) {
            console.log(response.body);
        }
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to team not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user1.id,
        });
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/teams/invalid-team-id`)
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 404) {
            console.log(response.body);
        }
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to user don't have permission to delete team", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const user2 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user2.id,
        });
        const team1 = yield (0, team_1.team)({ userId: user1.id });
        yield (0, team_member_1.teamMember)({ teamId: team1.id, userId: user2.id, role: "MEMBER" });
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/teams/${team1.id}`)
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 403) {
            console.log(response.body);
        }
        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error due to current user not is part from team", () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: user1.id,
        });
        const team1 = yield (0, team_1.team)();
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/teams/${team1.id}`)
            .set("authorization", `Bearer ${token}`);
        if (response.status !== 404) {
            console.log(response.body);
        }
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message");
    }));
});
