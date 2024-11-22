import request from "supertest";
import app from "../../src/app";
import { db } from "../helpers/db";
import { user } from "../factories/user";
import { revenue } from "../factories/revenue";
import { generateToken } from "../../src/services/jwt";
import { team } from "../factories/team";

describe("Revenue Test", () => {
  beforeAll(async () => {
    await db.updateSchema();
  });

  beforeEach(async () => {
    await db.reset();
  });

  test("should list team revenues", async () => {
    const currentUser = await user();
    const token = generateToken({
      userId: currentUser.id,
    });
    const revenue1 = await revenue({ userId: currentUser.id });
    await revenue({ userId: currentUser.id, teamId: revenue1.teamId });
    await revenue({ userId: currentUser.id });
    await revenue();

    const response = await request(app)
      .get(`/revenues/${revenue1.teamId}`)
      .set("Authorization", `Bearer ${token}`);

    if (response.status !== 200) {
      console.log(response.body);
    }

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  test("should return an error when listing team revenues due to no has token", async () => {
    const response = await request(app).get("/revenues/1");

    if (response.status !== 401) {
      console.log(response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error when listing team revenues due to no token is invalid", async () => {
    const response = await request(app)
      .get("/revenues/1")
      .set("Authorization", "Bearer 123");

    if (response.status !== 401) {
      console.log(response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error when listing team revenues due to user is not part from team", async () => {
    const currentUser = await user();
    const token = generateToken({
      userId: currentUser.id,
    });
    const team1 = await team();

    const response = await request(app)
      .get(`/revenues/${team1.id}`)
      .set("Authorization", `Bearer ${token}`);

    if (response.status !== 404) {
      console.log(response.body);
    }

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error when listing team revenues due to team not found", async () => {
    const currentUser = await user();
    const token = generateToken({
      userId: currentUser.id,
    });

    const response = await request(app)
      .get(`/revenues/team1`)
      .set("Authorization", `Bearer ${token}`);

    if (response.status !== 404) {
      console.log(response.body);
    }

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("should create an revenue", async () => {
    const currentUser = await user();
    const token = generateToken({
      userId: currentUser.id,
    });
    const team1 = await team({ userId: currentUser.id });

    const response = await request(app)
      .post("/revenues")
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
  });

  test("should create many revenues with recurrence", async () => {
    const currentUser = await user();
    const token = generateToken({
      userId: currentUser.id,
    });
    const team1 = await team({ userId: currentUser.id });

    const response = await request(app)
      .post("/revenues")
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
  });

  test("should create an revenue without not required fields", async () => {
    const currentUser = await user();
    const token = generateToken({
      userId: currentUser.id,
    });
    const team1 = await team({ userId: currentUser.id });

    const response = await request(app)
      .post("/revenues")
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
  });

  test("should return an error when creating an revenue due to no has token", async () => {
    const response = await request(app).post("/revenues");

    if (response.status !== 401) {
      console.log(response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error when creating an revenue due to no token is invalid", async () => {
    const response = await request(app)
      .post("/revenues")
      .set("Authorization", "Bearer 123");

    if (response.status !== 401) {
      console.log(response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error when creating an revenue due to user is not part from team", async () => {
    const currentUser = await user();
    const token = generateToken({
      userId: currentUser.id,
    });
    const team1 = await team();

    const response = await request(app)
      .post("/revenues")
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
  });

  test("should return an error when creating an revenue due to team not found", async () => {
    const currentUser = await user();
    const token = generateToken({
      userId: currentUser.id,
    });

    const response = await request(app)
      .post("/revenues")
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
  });

  test("should return an error when creating an revenue due to invalid data", async () => {
    const currentUser = await user();
    const token = generateToken({
      userId: currentUser.id,
    });
    const team1 = await team({ userId: currentUser.id });

    const response = await request(app)
      .post("/revenues")
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
  });

  test("should return an error when creating an revenue due to invalid recurrence", async () => {
    const currentUser = await user();
    const token = generateToken({
      userId: currentUser.id,
    });
    const team1 = await team({ userId: currentUser.id });

    const response = await request(app)
      .post("/revenues")
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
  });

  test("should return an error when creating an revenue due to is missing until", async () => {
    const currentUser = await user();
    const token = generateToken({
      userId: currentUser.id,
    });
    const team1 = await team({ userId: currentUser.id });

    const response = await request(app)
      .post("/revenues")
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
  });

  test("should return an error when creating an revenue due to until is not required for once recurrence", async () => {
    const currentUser = await user();
    const token = generateToken({
      userId: currentUser.id,
    });
    const team1 = await team({ userId: currentUser.id });

    const response = await request(app)
      .post("/revenues")
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
  });

  test("should update an revenue", async () => {
    const currentUser = await user();
    const token = generateToken({
      userId: currentUser.id,
    });
    const revenue1 = await revenue({ userId: currentUser.id });

    const response = await request(app)
      .put(`/revenues/${revenue1.teamId}/${revenue1.id}`)
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
  });

  test("should update an revenue in batch", async () => {
    const currentUser = await user();
    const token = generateToken({
      userId: currentUser.id,
    });
    const revenue1 = await revenue({
      userId: currentUser.id,
      recurrence: "monthly",
    });

    const response = await request(app)
      .put(`/revenues/${revenue1.teamId}/${revenue1.id}`)
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
  });

  test("should return an error when updating an revenue due to no has token", async () => {
    const response = await request(app).put("/revenues/1/1");

    if (response.status !== 401) {
      console.log(response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error when updating an revenue due to no token is invalid", async () => {
    const response = await request(app)
      .put("/revenues/1/1")
      .set("Authorization", "Bearer 123");

    if (response.status !== 401) {
      console.log(response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error when updating an revenue due to team not found", async () => {
    const currentUser = await user();
    const token = generateToken({
      userId: currentUser.id,
    });

    const response = await request(app)
      .put("/revenues/team1/1")
      .set("Authorization", `Bearer ${token}`);

    if (response.status !== 404) {
      console.log(response.body);
    }

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error when updating an revenue due to revenue not found", async () => {
    const currentUser = await user();
    const token = generateToken({
      userId: currentUser.id,
    });
    const team1 = await team({ userId: currentUser.id });

    const response = await request(app)
      .put(`/revenues/${team1.id}/1`)
      .set("Authorization", `Bearer ${token}`);

    if (response.status !== 404) {
      console.log(response.body);
    }

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

});
