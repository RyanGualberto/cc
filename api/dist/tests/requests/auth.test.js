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
describe("Auth Test", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.updateSchema();
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.reset();
    }));
    test("should login a user with email", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdUser = yield (0, user_1.user)();
        const response = yield (0, supertest_1.default)(app_1.default).post("/auth/login").send({
            email: createdUser.email,
            password: createdUser.password,
        });
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
        expect(response.header.authorization).toMatch(/^Bearer /);
    }));
    test("should login a user with phone", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdUser = yield (0, user_1.user)();
        const response = yield (0, supertest_1.default)(app_1.default).post("/auth/login").send({
            phone: createdUser.phone,
            password: createdUser.password,
        });
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
        expect(response.header.authorization).toMatch(/^Bearer /);
    }));
    test("should login a user with cpf", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdUser = yield (0, user_1.user)();
        const response = yield (0, supertest_1.default)(app_1.default).post("/auth/login").send({
            cpf: createdUser.cpf,
            password: createdUser.password,
        });
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
        expect(response.header.authorization).toMatch(/^Bearer /);
    }));
});
