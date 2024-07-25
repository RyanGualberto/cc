import { Request, Response } from "express";
import { handleError } from "../utils/handleError";
import { TeamModel } from "../model/team";
import { decodeTokenFromHeader, generateToken } from "../services/jwt";
import { AppError } from "../utils/appError";

export class Team {
  constructor() {}

  public async create(req: Request, res: Response) {
    try {
      const team = await TeamModel.create({
        name: req.body.name,
        userId: req.user.id,
      });

      return res.status(201).json(team);
    } catch (error: unknown) {
      return handleError(error, res, "Team.create");
    }
  }

  public async fetchTeams(req: Request, res: Response) {
    try {
      const team = await TeamModel.findUserTeams(req.user.id);

      return res.status(200).json(team);
    } catch (error: unknown) {
      return handleError(error, res, "Team.fetchTeam");
    }
  }

  public async fetchTeamById(req: Request, res: Response) {
    try {
      const team = await TeamModel.findTeam(req.user.id, req.params.teamId);

      return res.status(200).json(team);
    } catch (error: unknown) {
      return handleError(error, res, "Team.fetchTeamById");
    }
  }

  public async inviteMember(req: Request, res: Response) {
    try {
      const { email, teamId } = req.body;
      const invite = await TeamModel.inviteTeamMembers({
        email,
        teamId,
        userId: req.user.id,
      });

      const inviteToken = generateToken({ inviteId: invite.id });

      return res.status(201).json({ inviteToken });
    } catch (error: unknown) {
      return handleError(error, res, "Team.inviteMember");
    }
  }

  public async acceptInvite(req: Request, res: Response) {
    try {
      const inviteToken = req.query.token;

      if (!inviteToken) {
        throw new AppError("Invite token is required");
      }
      const decodedToken = decodeTokenFromHeader<{
        inviteId: string;
      }>(`Bearer ${inviteToken}`);

      const invite = await TeamModel.acceptInvite(
        req.user.id,
        decodedToken.inviteId
      );

      return res.status(200).json(invite);
    } catch (error: unknown) {
      return handleError(error, res, "Team.acceptInvite");
    }
  }
  public async removeMember(req: Request, res: Response) {
    try {
      await TeamModel.removeTeamMember(req.user.id, req.params.teamMemberId);
      return res.status(204).send();
    } catch (error: unknown) {
      return handleError(error, res, "Team.acceptInvite");
    }
  }
}
