import request from "supertest";
import app from "../../src/app";
import { db } from "../helpers/db";
import { user } from "../factories/user";

describe("Auth Test", () => {
  beforeAll(async () => {
    await db.updateSchema();
  });

  beforeEach(async () => {
    await db.reset();
  });

  test("should login a user with email", async () => {
    const createdUser = await user();

    const response = await request(app).post("/auth/login").send({
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
  });

  test("should login a user with phone", async () => {
    const createdUser = await user();

    const response = await request(app).post("/auth/login").send({
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
  });

  test("should login a user with cpf", async () => {
    const createdUser = await user();

    const response = await request(app).post("/auth/login").send({
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
  });
});
