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
exports.user = void 0;
const prismaClient_1 = __importDefault(require("../../src/clients/prismaClient"));
const faker_1 = require("@faker-js/faker");
const user = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = {
        first_name: faker_1.faker.person.firstName(),
        last_name: faker_1.faker.person.lastName(),
        email: faker_1.faker.internet.email(),
        password: faker_1.faker.internet.password(),
        cpf: String(Math.floor(Math.random() * 10000000000)),
        phone: faker_1.faker.phone.number(),
    };
    return yield prismaClient_1.default.user.create({
        data: Object.assign(Object.assign({}, user), data),
    });
});
exports.user = user;
