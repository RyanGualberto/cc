import request from "supertest";
import { faker } from "@faker-js/faker";

import app from "../../src/app";
import { db } from "../helpers/db";

import { user } from "../factories/user";
import { team } from "../factories/team";

import { generateToken } from "../../src/services/jwt";
import { teamInvite } from "../factories/team-invite";
import { teamMember } from "../factories/team-member";

describe("Team Test", () => {
  beforeAll(async () => {
    await db.updateSchema();
  });

  beforeEach(async () => {
    await db.reset();
  });

  test("should create a team", async () => {
    const user1 = await user();
    const token = generateToken({
      userId: user1.id,
    });
    const response = await request(app)
      .post("/teams")
      .send({
        name: faker.company.name(),
      })
      .set("authorization", `Bearer ${token}`);

    if (response.status !== 201) {
      console.log(response.body);
    }

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("teamMembers");
    expect(response.body.teamMembers).toHaveLength(1);
  });

  test("should return an error due to no has token", async () => {
    const response = await request(app).post("/teams").send({
      name: faker.company.name(),
    });

    if (response.status !== 401) {
      console.log(response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error due to token is invalid", async () => {
    const response = await request(app)
      .post("/teams")
      .send({
        name: faker.company.name(),
      })
      .set("authorization", `Bearer invalid-token`);

    if (response.status !== 401) {
      console.log(response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error due to no has name on body", async () => {
    const user1 = await user();
    const token = generateToken({
      userId: user1.id,
    });
    const response = await request(app)
      .post("/teams")
      .send()
      .set("authorization", `Bearer ${token}`);

    if (response.status !== 400) {
      console.log(response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("should return just teams from current user", async () => {
    const user1 = await user();
    const token = generateToken({
      userId: user1.id,
    });
    const team1 = await team({ userId: user1.id });
    await team();
    const response = await request(app)
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
  });

  test("should return an error due to no has token", async () => {
    const response = await request(app).get("/teams").send();

    if (response.status !== 401) {
      console.log(response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error due to token is invalid", async () => {
    const response = await request(app)
      .get("/teams")
      .send()
      .set("authorization", `Bearer invalid-token`);

    if (response.status !== 401) {
      console.log(response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should return team by id", async () => {
    const user1 = await user();
    const token = generateToken({
      userId: user1.id,
    });
    const team1 = await team({ userId: user1.id });

    const response = await request(app)
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
  });

  test("should return an error due to no has token", async () => {
    const response = await request(app).get("/teams/team-id").send();

    if (response.status !== 401) {
      console.log(response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error due to token is invalid", async () => {
    const response = await request(app)
      .get("/teams/team-id")
      .send()
      .set("authorization", `Bearer invalid-token`);

    if (response.status !== 401) {
      console.log(response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error due to not found team", async () => {
    const user1 = await user();
    const token = generateToken({
      userId: user1.id,
    });

    const response = await request(app)
      .get("/teams/invalid-team-id")
      .send()
      .set("authorization", `Bearer ${token}`);

    if (response.status !== 404) {
      console.log(response.body);
    }

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error due to user no is part from team", async () => {
    const user1 = await user();
    const token = generateToken({
      userId: user1.id,
    });
    const team1 = await team();

    const response = await request(app)
      .get(`/teams/${team1.id}`)
      .send()
      .set("authorization", `Bearer ${token}`);

    if (response.status !== 404) {
      console.log(response.body);
    }

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("should create an invite to a team", async () => {
    const user1 = await user();
    const token = generateToken({
      userId: user1.id,
    });
    const team1 = await team({ userId: user1.id });
    const email = faker.internet.email();
    const response = await request(app)
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
  });

  test("should return an error due to no has token", async () => {
    const response = await request(app).post(`/teams/invites/create`);

    if (response.status !== 401) {
      console.log(response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error due to token is invalid", async () => {
    const response = await request(app)
      .post(`/teams/invites/create`)
      .set("authorization", `Bearer invalid-token`);

    if (response.status !== 401) {
      console.log(response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error due to no has email", async () => {
    const user1 = await user();
    const token = generateToken({
      userId: user1.id,
    });
    const team1 = await team({ userId: user1.id });
    const response = await request(app)
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
  });

  test("should return an error due to no has teamId", async () => {
    const user1 = await user();
    const token = generateToken({
      userId: user1.id,
    });
    const response = await request(app)
      .post(`/teams/invites/create`)
      .send({
        email: faker.internet.email(),
      })
      .set("authorization", `Bearer ${token}`);

    if (response.status !== 404) {
      console.log(response.body);
    }

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error due to not found team", async () => {
    const user1 = await user();
    const token = generateToken({
      userId: user1.id,
    });
    const response = await request(app)
      .post(`/teams/invites/create`)
      .send({
        email: faker.internet.email(),
        teamId: "invalid-team-id",
      })
      .set("authorization", `Bearer ${token}`);

    if (response.status !== 404) {
      console.log(response.body);
    }

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error due to invite already exists", async () => {
    const user1 = await user();
    const token = generateToken({
      userId: user1.id,
    });
    const invite = await teamInvite({ userId: user1.id });
    const response = await request(app)
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
  });

  test("should return an error due to user don't have permission to invite to team", async () => {
    const user1 = await user();
    const user2 = await user();
    const token = generateToken({
      userId: user2.id,
    });
    const team1 = await team({ userId: user1.id });
    await teamMember({ teamId: team1.id, userId: user2.id, role: "MEMBER" });

    const response = await request(app)
      .post(`/teams/invites/create`)
      .send({
        email: faker.internet.email(),
        teamId: team1.id,
      })
      .set("authorization", `Bearer ${token}`);

    if (response.status !== 403) {
      console.log(response.body);
    }

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
  });

  test("should accept an invite to a team", async () => {
    const user1 = await user();
    const token = generateToken({
      userId: user1.id,
    });
    const invite = await teamInvite({ email: user1.email });
    const inviteToken = generateToken({ inviteId: invite.id });

    const response = await request(app)
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
  });

  test("should return an error due to no has token", async () => {
    const invite = await teamInvite();
    const inviteToken = generateToken({ inviteId: invite.id });

    const response = await request(app)
      .post(`/teams/invites/accept?token=${inviteToken}`)
      .send({
        email: invite.email,
      });

    if (response.status !== 401) {
      console.log(response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error due to token is invalid", async () => {
    const invite = await teamInvite();
    const inviteToken = generateToken({ inviteId: invite.id });

    const response = await request(app)
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
  });

  test("should return an error due to no has invite token", async () => {
    const user1 = await user();
    const token = generateToken({
      userId: user1.id,
    });

    const response = await request(app)
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
  });

  test("should return an error due to no has email", async () => {
    const user1 = await user();
    const token = generateToken({
      userId: user1.id,
    });
    const invite = await teamInvite();
    const inviteToken = generateToken({ inviteId: invite.id });

    const response = await request(app)
      .post(`/teams/invites/accept?token=${inviteToken}`)
      .set("authorization", `Bearer ${token}`);

    if (response.status !== 404) {
      console.log(response.body);
    }

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("should remove a team member", async () => {
    const user1 = await user();
    const token = generateToken({
      userId: user1.id,
    });

    const team1 = await team({ userId: user1.id });
    const teamMember1 = await teamMember({ teamId: team1.id });

    const response = await request(app)
      .delete(`/teams/${team1.id}/members/${teamMember1.id}`)
      .set("authorization", `Bearer ${token}`);

    if (response.status !== 204) {
      console.log(response.body);
    }

    expect(response.status).toBe(204);
  });

  test("should return an error due to no has token", async () => {
    const response = await request(app).delete(
      `/teams/team-id/members/member-id`
    );

    if (response.status !== 401) {
      console.log(response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error due to token is invalid", async () => {
    const response = await request(app)
      .delete(`/teams/team-id/members/member-id`)
      .set("authorization", `Bearer invalid-token`);

    if (response.status !== 401) {
      console.log(response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error due to team member not found", async () => {
    const user1 = await user();
    const token = generateToken({
      userId: user1.id,
    });
    const team1 = await team({ userId: user1.id });

    const response = await request(app)
      .delete(`/teams/${team1.id}/members/invalid-member-id`)
      .set("authorization", `Bearer ${token}`);

    if (response.status !== 404) {
      console.log(response.body);
    }

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error due to user can't remove yourself from the team", async () => {
    const user1 = await user();
    const token = generateToken({
      userId: user1.id,
    });
    const team1 = await team({ userId: user1.id });
    const teamMember1 = await teamMember({
      teamId: team1.id,
      userId: user1.id,
    });

    const response = await request(app)
      .delete(`/teams/${team1.id}/members/${teamMember1.id}`)
      .set("authorization", `Bearer ${token}`);

    if (response.status !== 400) {
      console.log(response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error due to user don't have permission to remove team member", async () => {
    const user1 = await user();
    const user2 = await user();
    const token = generateToken({
      userId: user2.id,
    });
    const team1 = await team({ userId: user1.id });
    const teamMember1 = await teamMember({ teamId: team1.id });
    await teamMember({ teamId: team1.id, userId: user2.id, role: "MEMBER" });

    const response = await request(app)
      .delete(`/teams/${team1.id}/members/${teamMember1.id}`)
      .set("authorization", `Bearer ${token}`);

    if (response.status !== 403) {
      console.log(response.body);
    }

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error due to current user not is part from team", async () => {
    const user1 = await user();
    const token = generateToken({
      userId: user1.id,
    });
    const teamMember1 = await teamMember();

    const response = await request(app)
      .delete(`/teams/${teamMember1.teamId}/members/${teamMember1.id}`)
      .set("authorization", `Bearer ${token}`);

    if (response.status !== 404) {
      console.log(response.body);
    }

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("should update a team member role", async () => {
    const user1 = await user();
    const token = generateToken({
      userId: user1.id,
    });
    const team1 = await team({ userId: user1.id });
    const teamMember1 = await teamMember({ teamId: team1.id });

    const response = await request(app)
      .put(`/teams/${team1.id}/members/${teamMember1.id}`)
      .send({
        role: "ADMIN",
      })
      .set("authorization", `Bearer ${token}`);

    if (response.status !== 200) {
      console.log(response.body);
    }

    expect(response.status).toBe(200);
  });

  test("should return an error due to no has token", async () => {
    const response = await request(app).put(`/teams/team-id/members/member-id`);

    if (response.status !== 401) {
      console.log(response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error due to token is invalid", async () => {
    const response = await request(app)
      .put(`/teams/team-id/members/member-id`)
      .set("authorization", `Bearer invalid-token`);

    if (response.status !== 401) {
      console.log(response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error due to no has role on body", async () => {
    const user1 = await user();
    const token = generateToken({
      userId: user1.id,
    });
    const team1 = await team({ userId: user1.id });
    const teamMember1 = await teamMember({ teamId: team1.id });

    const response = await request(app)
      .put(`/teams/${team1.id}/members/${teamMember1.id}`)
      .set("authorization", `Bearer ${token}`);

    if (response.status !== 400) {
      console.log(response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error due to team member not found", async () => {
    const user1 = await user();
    const token = generateToken({
      userId: user1.id,
    });
    const team1 = await team({ userId: user1.id });

    const response = await request(app)
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
  });

  test("should return an error due to user don't have permission to update team member role", async () => {
    const user1 = await user();
    const user2 = await user();
    const token = generateToken({
      userId: user2.id,
    });
    const team1 = await team({ userId: user1.id });
    const teamMember1 = await teamMember({ teamId: team1.id });
    await teamMember({ teamId: team1.id, userId: user2.id, role: "MEMBER" });

    const response = await request(app)
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
  });

  test("should return an error due to current user not is part from team", async () => {
    const user1 = await user();
    const token = generateToken({
      userId: user1.id,
    });
    const teamMember1 = await teamMember();

    const response = await request(app)
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
  });

  test("should update a team", async () => {
    const user1 = await user();
    const token = generateToken({
      userId: user1.id,
    });
    const team1 = await team({ userId: user1.id });

    const response = await request(app)
      .put(`/teams/${team1.id}`)
      .send({
        name: faker.company.name(),
      })
      .set("authorization", `Bearer ${token}`);

    if (response.status !== 200) {
      console.log(response.body);
    }

    expect(response.status).toBe(200);
  });

  test("should return an error due to no has token", async () => {
    const response = await request(app).put(`/teams/team-id`);

    if (response.status !== 401) {
      console.log(response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error due to token is invalid", async () => {
    const response = await request(app)
      .put(`/teams/team-id`)
      .set("authorization", `Bearer invalid-token`);

    if (response.status !== 401) {
      console.log(response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error due to no has name on body", async () => {
    const user1 = await user();
    const token = generateToken({
      userId: user1.id,
    });
    const team1 = await team({ userId: user1.id });

    const response = await request(app)
      .put(`/teams/${team1.id}`)
      .set("authorization", `Bearer ${token}`);

    if (response.status !== 400) {
      console.log(response.body);
    }

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error due to team not found", async () => {
    const user1 = await user();
    const token = generateToken({
      userId: user1.id,
    });

    const response = await request(app)
      .put(`/teams/invalid-team-id`)
      .send({
        name: faker.company.name(),
      })
      .set("authorization", `Bearer ${token}`);

    if (response.status !== 404) {
      console.log(response.body);
    }

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error due to user don't have permission to update team", async () => {
    const user1 = await user();
    const user2 = await user();
    const token = generateToken({
      userId: user2.id,
    });
    const team1 = await team({ userId: user1.id });
    await teamMember({ teamId: team1.id, userId: user2.id, role: "MEMBER" });

    const response = await request(app)
      .put(`/teams/${team1.id}`)
      .send({
        name: faker.company.name() + " updated",
      })
      .set("authorization", `Bearer ${token}`);

    if (response.status !== 403) {
      console.log("ERRO NO TESTE", team1.name, response.body.name);
    }

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error due to current user not is part from team", async () => {
    const user1 = await user();
    const token = generateToken({
      userId: user1.id,
    });
    const team1 = await team();

    const response = await request(app)
      .put(`/teams/${team1.id}`)
      .send({
        name: faker.company.name(),
      })
      .set("authorization", `Bearer ${token}`);

    if (response.status !== 404) {
      console.log(response.body);
    }

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("should delete a team", async () => {
    const user1 = await user();
    const token = generateToken({
      userId: user1.id,
    });
    const team1 = await team({ userId: user1.id });

    const response = await request(app)
      .delete(`/teams/${team1.id}`)
      .set("authorization", `Bearer ${token}`);

    if (response.status !== 204) {
      console.log(response.body);
    }

    expect(response.status).toBe(204);
  });

  test("should return an error due to no has token", async () => {
    const response = await request(app).delete(`/teams/team-id`);

    if (response.status !== 401) {
      console.log(response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error due to token is invalid", async () => {
    const response = await request(app)
      .delete(`/teams/team-id`)
      .set("authorization", `Bearer invalid-token`);

    if (response.status !== 401) {
      console.log(response.body);
    }

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error due to team not found", async () => {
    const user1 = await user();
    const token = generateToken({
      userId: user1.id,
    });

    const response = await request(app)
      .delete(`/teams/invalid-team-id`)
      .set("authorization", `Bearer ${token}`);

    if (response.status !== 404) {
      console.log(response.body);
    }

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error due to user don't have permission to delete team", async () => {
    const user1 = await user();
    const user2 = await user();
    const token = generateToken({
      userId: user2.id,
    });
    const team1 = await team({ userId: user1.id });
    await teamMember({ teamId: team1.id, userId: user2.id, role: "MEMBER" });

    const response = await request(app)
      .delete(`/teams/${team1.id}`)
      .set("authorization", `Bearer ${token}`);

    if (response.status !== 403) {
      console.log(response.body);
    }

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
  });

  test("should return an error due to current user not is part from team", async () => {
    const user1 = await user();
    const token = generateToken({
      userId: user1.id,
    });
    const team1 = await team();

    const response = await request(app)
      .delete(`/teams/${team1.id}`)
      .set("authorization", `Bearer ${token}`);

    if (response.status !== 404) {
      console.log(response.body);
    }

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });
});
