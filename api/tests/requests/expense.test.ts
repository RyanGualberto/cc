import request from "supertest";
import app from "../../src/app";
import { db } from "../helpers/db";
import { user } from "../factories/user";
import { expense } from "../factories/expense";
import { generateToken } from "../../src/services/jwt";
import { team } from "../factories/team";

describe("Expense Test", () => {
  beforeAll(async () => {
    await db.updateSchema();
  });

  beforeEach(async () => {
    await db.reset();
  });

  test("should list team expenses", async () => {
    const currentUser = await user();
    const token = generateToken({
      userId: currentUser.id,
    });
    const expense1 = await expense({ userId: currentUser.id });
    await expense({ userId: currentUser.id, teamId: expense1.teamId });
    await expense({ userId: currentUser.id });
    await expense();

    const response = await request(app)
      .get(`/expenses/${expense1.teamId}`)
      .set("Authorization", `Bearer ${token}`);

    if (response.status !== 200) {
      console.log(response.body);
    }

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  test("should return an error when listing team expenses due to no has token", async () => {
    const response = await request(app).get("/expenses/1");

    if (response.status !== 401) {
      console.log(response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error when listing team expenses due to no token is invalid", async () => {
    const response = await request(app)
      .get("/expenses/1")
      .set("Authorization", "Bearer 123");

    if (response.status !== 401) {
      console.log(response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error when listing team expenses due to user is not part from team", async () => {
    const currentUser = await user();
    const token = generateToken({
      userId: currentUser.id,
    });
    const team1 = await team();

    const response = await request(app)
      .get(`/expenses/${team1.id}`)
      .set("Authorization", `Bearer ${token}`);

    if (response.status !== 404) {
      console.log(response.body);
    }

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error when listing team expenses due to team not found", async () => {
    const currentUser = await user();
    const token = generateToken({
      userId: currentUser.id,
    });

    const response = await request(app)
      .get(`/expenses/team1`)
      .set("Authorization", `Bearer ${token}`);

    if (response.status !== 404) {
      console.log(response.body);
    }

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("should create an expense", async () => {
    const currentUser = await user();
    const token = generateToken({
      userId: currentUser.id,
    });
    const team1 = await team({ userId: currentUser.id });

    const response = await request(app)
      .post("/expenses")
      .send({
        title: "Title",
        description: "Description",
        recurrence: "monthly",
        amountInCents: 1000,
        userId: currentUser.id,
        teamId: team1.id,
      })
      .set("Authorization", `Bearer ${token}`);

    if (response.status !== 201) {
      console.log(response.body);
    }

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  test("should create an expense without not required fields", async () => {
    const currentUser = await user();
    const token = generateToken({
      userId: currentUser.id,
    });
    const team1 = await team({ userId: currentUser.id });

    const response = await request(app)
      .post("/expenses")
      .send({
        title: "Title",
        recurrence: "monthly",
        amountInCents: 1000,
        userId: currentUser.id,
        teamId: team1.id,
      })
      .set("Authorization", `Bearer ${token}`);

    if (response.status !== 201) {
      console.log(response.body);
    }

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  test("should return an error when creating an expense due to no has token", async () => {
    const response = await request(app).post("/expenses");

    if (response.status !== 401) {
      console.log(response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error when creating an expense due to no token is invalid", async () => {
    const response = await request(app)
      .post("/expenses")
      .set("Authorization", "Bearer 123");

    if (response.status !== 401) {
      console.log(response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error when creating an expense due to user is not part from team", async () => {
    const currentUser = await user();
    const token = generateToken({
      userId: currentUser.id,
    });
    const team1 = await team();

    const response = await request(app)
      .post("/expenses")
      .send({
        title: "Title",
        description: "Description",
        recurrence: "monthly",
        amountInCents: 1000,
        userId: currentUser.id,
        teamId: team1.id,
      })
      .set("Authorization", `Bearer ${token}`);

    if (response.status !== 404) {
      console.log(response.body);
    }

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error when creating an expense due to team not found", async () => {
    const currentUser = await user();
    const token = generateToken({
      userId: currentUser.id,
    });

    const response = await request(app)
      .post("/expenses")
      .send({
        title: "Title",
        description: "Description",
        recurrence: "monthly",
        amountInCents: 1000,
        userId: currentUser.id,
        teamId: "team1",
      })
      .set("Authorization", `Bearer ${token}`);

    if (response.status !== 404) {
      console.log(response.body);
    }

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error when creating an expense due to invalid data", async () => {
    const currentUser = await user();
    const token = generateToken({
      userId: currentUser.id,
    });
    const team1 = await team({ userId: currentUser.id });

    const response = await request(app)
      .post("/expenses")
      .send({
        description: "Description",
        recurrence: "monthly",
        userId: currentUser.id,
        teamId: team1.id,
      })
      .set("Authorization", `Bearer ${token}`);

    if (response.status !== 400) {
      console.log(response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});
