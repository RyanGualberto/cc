import request from "supertest";
import { faker } from "@faker-js/faker";

import app from "../../src/app";
import { db } from "../helpers/db";

import { user } from "../factories/user";

import { generateToken } from "../../src/services/jwt";

describe("User Test", () => {
  beforeAll(async () => {
    await db.updateSchema();
  });

  beforeEach(async () => {
    await db.reset();
  });

  test("should create a user", async () => {
    const response = await request(app)
      .post("/users")
      .send({
        email: faker.internet.email(),
        password: faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        phone: faker.phone.number(),
        cpf: String(faker.number.int(11)),
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
  });

  test("should return a bad request error due to duplicated email", async () => {
    const createdUser = await user();
    const response = await request(app)
      .post("/users")
      .send({
        email: createdUser.email,
        password: faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        phone: faker.phone.number(),
        cpf: String(faker.number.int(11)),
      });

    if (response.status !== 400) {
      console.log(response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "The email is already in use"
    );
    expect(response.body).toHaveProperty("status", 400);
  });

  test("should return a bad request error due to duplicated cpf", async () => {
    const createdUser = await user();
    const response = await request(app).post("/users").send({
      email: faker.internet.email(),
      password: faker.internet.password(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      phone: faker.phone.number(),
      cpf: createdUser.cpf,
    });

    if (response.status !== 400) {
      console.log(response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "The cpf is already in use"
    );
    expect(response.body).toHaveProperty("status", 400);
  });

  test("should return a bad request error due to duplicated phone", async () => {
    const createdUser = await user();
    const response = await request(app)
      .post("/users")
      .send({
        email: faker.internet.email(),
        password: faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        phone: createdUser.phone,
        cpf: String(faker.number.int(11)),
      });

    if (response.status !== 400) {
      console.log(response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "The phone is already in use"
    );
    expect(response.body).toHaveProperty("status", 400);
  });

  test("should return a bad request error due to is missing some field", async () => {
    const response = await request(app)
      .post("/users")
      .send({
        password: faker.internet.password(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        phone: faker.phone.number(),
        cpf: String(faker.number.int(11)),
      });

    if (response.status !== 400) {
      console.log(response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("status", 400);
  });

  test("should return current user", async () => {
    const createdUser = await user();
    const token = generateToken({ userId: createdUser.id });
    const response = await request(app)
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
  });

  test("should return a unauthorized error due to no has token", async () => {
    const response = await request(app).get(`/users/me`);

    if (response.status !== 401) {
      console.log(response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Unauthorized");
  });

  test("should return a unauthorized error due to has an invalid token", async () => {
    const createdUser = await user();
    const token = generateToken({ userId: createdUser.id });
    const response = await request(app)
      .get(`/users/me`)
      .set("Authorization", `Bearer invalid${token}`);

    if (response.status !== 401) {
      console.log(response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Unauthorized");
  });
});
