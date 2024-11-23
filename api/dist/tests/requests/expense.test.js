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
const app_1 = __importDefault(require("../../src/app"));
const db_1 = require("../helpers/db");
const user_1 = require("../factories/user");
const expense_1 = require("../factories/expense");
const jwt_1 = require("../../src/services/jwt");
const team_1 = require("../factories/team");
describe("Expense Test", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.updateSchema();
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.reset();
    }));
    test("should list team expenses", () => __awaiter(void 0, void 0, void 0, function* () {
        const currentUser = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: currentUser.id,
        });
        const expense1 = yield (0, expense_1.expense)({ userId: currentUser.id });
        yield (0, expense_1.expense)({ userId: currentUser.id, teamId: expense1.teamId });
        yield (0, expense_1.expense)({ userId: currentUser.id });
        yield (0, expense_1.expense)();
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/expenses/${expense1.teamId}`)
            .set("Authorization", `Bearer ${token}`);
        if (response.status !== 200) {
            console.log(response.body);
        }
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
    }));
    test("should return an error when listing team expenses due to no has token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get("/expenses/1");
        if (response.status !== 401) {
            console.log(response.body);
        }
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error when listing team expenses due to no token is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get("/expenses/1")
            .set("Authorization", "Bearer 123");
        if (response.status !== 401) {
            console.log(response.body);
        }
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error when listing team expenses due to user is not part from team", () => __awaiter(void 0, void 0, void 0, function* () {
        const currentUser = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: currentUser.id,
        });
        const team1 = yield (0, team_1.team)();
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/expenses/${team1.id}`)
            .set("Authorization", `Bearer ${token}`);
        if (response.status !== 404) {
            console.log(response.body);
        }
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error when listing team expenses due to team not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const currentUser = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: currentUser.id,
        });
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/expenses/team1`)
            .set("Authorization", `Bearer ${token}`);
        if (response.status !== 404) {
            console.log(response.body);
        }
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message");
    }));
    test("should create an expense", () => __awaiter(void 0, void 0, void 0, function* () {
        const currentUser = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: currentUser.id,
        });
        const team1 = yield (0, team_1.team)({ userId: currentUser.id });
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/expenses")
            .send({
            title: "Title",
            description: "Description",
            date: new Date(),
            recurrence: "once",
            amountInCents: 1000,
            teamId: team1.id,
        })
            .set("Authorization", `Bearer ${token}`);
        if (response.status !== 201) {
            console.log(response.body);
        }
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    }));
    test("should create many expenses with recurrence", () => __awaiter(void 0, void 0, void 0, function* () {
        const currentUser = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: currentUser.id,
        });
        const team1 = yield (0, team_1.team)({ userId: currentUser.id });
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/expenses")
            .send({
            title: "Title",
            description: "Description",
            date: new Date(),
            until: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            recurrence: "monthly",
            amountInCents: 1000,
            teamId: team1.id,
        })
            .set("Authorization", `Bearer ${token}`);
        if (response.status !== 201) {
            console.log(response.body);
        }
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("count");
        expect(response.body).toMatchObject({ count: 12 });
    }));
    test("should create an expense without not required fields", () => __awaiter(void 0, void 0, void 0, function* () {
        const currentUser = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: currentUser.id,
        });
        const team1 = yield (0, team_1.team)({ userId: currentUser.id });
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/expenses")
            .send({
            title: "Title",
            recurrence: "once",
            date: new Date(),
            amountInCents: 1000,
            teamId: team1.id,
        })
            .set("Authorization", `Bearer ${token}`);
        if (response.status !== 201) {
            console.log(response.body);
        }
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    }));
    test("should return an error when creating an expense due to no has token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post("/expenses");
        if (response.status !== 401) {
            console.log(response.body);
        }
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error when creating an expense due to no token is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/expenses")
            .set("Authorization", "Bearer 123");
        if (response.status !== 401) {
            console.log(response.body);
        }
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error when creating an expense due to user is not part from team", () => __awaiter(void 0, void 0, void 0, function* () {
        const currentUser = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: currentUser.id,
        });
        const team1 = yield (0, team_1.team)();
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/expenses")
            .send({
            title: "Title",
            description: "Description",
            recurrence: "monthly",
            amountInCents: 1000,
            teamId: team1.id,
        })
            .set("Authorization", `Bearer ${token}`);
        if (response.status !== 404) {
            console.log(response.body);
        }
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error when creating an expense due to team not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const currentUser = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: currentUser.id,
        });
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/expenses")
            .send({
            title: "Title",
            description: "Description",
            recurrence: "monthly",
            amountInCents: 1000,
            teamId: "team1",
        })
            .set("Authorization", `Bearer ${token}`);
        if (response.status !== 404) {
            console.log(response.body);
        }
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error when creating an expense due to invalid data", () => __awaiter(void 0, void 0, void 0, function* () {
        const currentUser = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: currentUser.id,
        });
        const team1 = yield (0, team_1.team)({ userId: currentUser.id });
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/expenses")
            .send({
            description: "Description",
            recurrence: "monthly",
            teamId: team1.id,
        })
            .set("Authorization", `Bearer ${token}`);
        if (response.status !== 400) {
            console.log(response.body);
        }
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error when creating an expense due to invalid recurrence", () => __awaiter(void 0, void 0, void 0, function* () {
        const currentUser = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: currentUser.id,
        });
        const team1 = yield (0, team_1.team)({ userId: currentUser.id });
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/expenses")
            .send({
            title: "Title",
            description: "Description",
            recurrence: "invalid",
            amountInCents: 1000,
            teamId: team1.id,
        })
            .set("Authorization", `Bearer ${token}`);
        if (response.status !== 400) {
            console.log(response.body);
        }
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error when creating an expense due to is missing until", () => __awaiter(void 0, void 0, void 0, function* () {
        const currentUser = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: currentUser.id,
        });
        const team1 = yield (0, team_1.team)({ userId: currentUser.id });
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/expenses")
            .send({
            title: "Title",
            description: "Description",
            recurrence: "monthly",
            amountInCents: 1000,
            teamId: team1.id,
        })
            .set("Authorization", `Bearer ${token}`);
        if (response.status !== 400) {
            console.log(response.body);
        }
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error when creating an expense due to until is not required for once recurrence", () => __awaiter(void 0, void 0, void 0, function* () {
        const currentUser = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: currentUser.id,
        });
        const team1 = yield (0, team_1.team)({ userId: currentUser.id });
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/expenses")
            .send({
            title: "Title",
            description: "Description",
            recurrence: "once",
            until: new Date(),
            amountInCents: 1000,
            teamId: team1.id,
        })
            .set("Authorization", `Bearer ${token}`);
        if (response.status !== 400) {
            console.log(response.body);
        }
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
    }));
    test("should update an expense", () => __awaiter(void 0, void 0, void 0, function* () {
        const currentUser = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: currentUser.id,
        });
        const expense1 = yield (0, expense_1.expense)({ userId: currentUser.id });
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/expenses/${expense1.teamId}/${expense1.id}`)
            .send({
            title: "Title",
            description: "Description",
            date: new Date(),
            recurrence: "once",
            amountInCents: 1000,
            status: "pending",
        })
            .set("Authorization", `Bearer ${token}`);
        if (response.status !== 200) {
            console.log(response.body);
        }
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id");
    }));
    test("should update an expense in batch", () => __awaiter(void 0, void 0, void 0, function* () {
        const currentUser = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: currentUser.id,
        });
        const expense1 = yield (0, expense_1.expense)({
            userId: currentUser.id,
            recurrence: "monthly",
        });
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/expenses/${expense1.teamId}/${expense1.id}`)
            .send({
            title: "Title",
            description: "Description",
            date: new Date(),
            includeFuture: true,
            amountInCents: 1000,
            status: "pending",
        })
            .set("Authorization", `Bearer ${token}`);
        if (response.status !== 200) {
            console.log(response.body);
        }
        expect(response.status).toBe(200);
    }));
    test("should return an error when updating an expense due to no has token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).put("/expenses/1/1");
        if (response.status !== 401) {
            console.log(response.body);
        }
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error when updating an expense due to no token is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .put("/expenses/1/1")
            .set("Authorization", "Bearer 123");
        if (response.status !== 401) {
            console.log(response.body);
        }
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error when updating an expense due to team not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const currentUser = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: currentUser.id,
        });
        const response = yield (0, supertest_1.default)(app_1.default)
            .put("/expenses/team1/1")
            .set("Authorization", `Bearer ${token}`);
        if (response.status !== 404) {
            console.log(response.body);
        }
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message");
    }));
    test("should return an error when updating an expense due to expense not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const currentUser = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({
            userId: currentUser.id,
        });
        const team1 = yield (0, team_1.team)({ userId: currentUser.id });
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/expenses/${team1.id}/1`)
            .set("Authorization", `Bearer ${token}`);
        if (response.status !== 404) {
            console.log(response.body);
        }
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message");
    }));
});
