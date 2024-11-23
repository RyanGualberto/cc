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
const jwt_1 = require("../../src/services/jwt");
describe("User Test", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.updateSchema();
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.reset();
    }));
    test("should create a user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/users")
            .send({
            email: faker_1.faker.internet.email(),
            password: faker_1.faker.internet.password(),
            first_name: faker_1.faker.person.firstName(),
            last_name: faker_1.faker.person.lastName(),
            phone: faker_1.faker.phone.number(),
            cpf: String(faker_1.faker.number.int(11)),
        });
        if (response.status !== 201) {
            console.log(response.body);
        }
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            id: expect.any(String),
            email: expect.any(String),
            first_name: expect.any(String),
            last_name: expect.any(String),
            phone: expect.any(String),
            cpf: expect.any(String),
        });
        expect(response.header.authorization).toMatch(/^Bearer /);
    }));
    test("should return a bad request error due to duplicated email", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdUser = yield (0, user_1.user)();
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/users")
            .send({
            email: createdUser.email,
            password: faker_1.faker.internet.password(),
            first_name: faker_1.faker.person.firstName(),
            last_name: faker_1.faker.person.lastName(),
            phone: faker_1.faker.phone.number(),
            cpf: String(faker_1.faker.number.int(11)),
        });
        if (response.status !== 400) {
            console.log(response.body);
        }
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "The email is already in use");
        expect(response.body).toHaveProperty("status", 400);
    }));
    test("should return a bad request error due to duplicated cpf", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdUser = yield (0, user_1.user)();
        const response = yield (0, supertest_1.default)(app_1.default).post("/users").send({
            email: faker_1.faker.internet.email(),
            password: faker_1.faker.internet.password(),
            first_name: faker_1.faker.person.firstName(),
            last_name: faker_1.faker.person.lastName(),
            phone: faker_1.faker.phone.number(),
            cpf: createdUser.cpf,
        });
        if (response.status !== 400) {
            console.log(response.body);
        }
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "The cpf is already in use");
        expect(response.body).toHaveProperty("status", 400);
    }));
    test("should return a bad request error due to duplicated phone", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdUser = yield (0, user_1.user)();
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/users")
            .send({
            email: faker_1.faker.internet.email(),
            password: faker_1.faker.internet.password(),
            first_name: faker_1.faker.person.firstName(),
            last_name: faker_1.faker.person.lastName(),
            phone: createdUser.phone,
            cpf: String(faker_1.faker.number.int(11)),
        });
        if (response.status !== 400) {
            console.log(response.body);
        }
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "The phone is already in use");
        expect(response.body).toHaveProperty("status", 400);
    }));
    test("should return a bad request error due to is missing some field", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/users")
            .send({
            password: faker_1.faker.internet.password(),
            first_name: faker_1.faker.person.firstName(),
            last_name: faker_1.faker.person.lastName(),
            phone: faker_1.faker.phone.number(),
            cpf: String(faker_1.faker.number.int(11)),
        });
        if (response.status !== 400) {
            console.log(response.body);
        }
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("status", 400);
    }));
    test("should return current user", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdUser = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({ userId: createdUser.id });
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/users/me`)
            .set("Authorization", `Bearer ${token}`);
        if (response.status !== 200) {
            console.log(response.body);
        }
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id: expect.any(String),
            email: expect.any(String),
            first_name: expect.any(String),
            last_name: expect.any(String),
            phone: expect.any(String),
            cpf: expect.any(String),
        });
    }));
    test("should return a unauthorized error due to no has token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get(`/users/me`);
        if (response.status !== 401) {
            console.log(response.body);
        }
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "Unauthorized");
    }));
    test("should return a unauthorized error due to has an invalid token", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdUser = yield (0, user_1.user)();
        const token = (0, jwt_1.generateToken)({ userId: createdUser.id });
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/users/me`)
            .set("Authorization", `Bearer invalid${token}`);
        if (response.status !== 401) {
            console.log(response.body);
        }
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "Unauthorized");
    }));
});
