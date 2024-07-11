import request from "supertest";
import app from "../../src/app";
import { db } from "../helpers/db";
import { user } from "../factories/user";

describe("Sample Test", () => {
  beforeAll(async () => {
    await db.setup();
  });

  test("should test that true === true", async () => {
    await user({});
    const response = await request(app).get("/users/me");
    expect(response.status).toBe(200);
  });
});
