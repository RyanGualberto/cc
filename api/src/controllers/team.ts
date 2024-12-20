import { Request, Response } from "express";
import { handleError } from "../utils/handleError";
import { TeamModel } from "../model/team";
import { decodeTokenFromHeader, generateToken } from "../services/jwt";
import { AppError } from "../utils/appError";
import { mailTransporter } from "../clients/mailer-client";
import { inviteTemplate } from "../templates/invite-template";

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

  public async updateTeam(req: Request, res: Response) {
    try {
      await TeamModel.updateTeam(req.user.id, req.params.teamId, req.body);

      return res.status(200).send();
    } catch (error: unknown) {
      return handleError(error, res, "Team.update");
    }
  }

  public async deleteTeam(req: Request, res: Response) {
    try {
      await TeamModel.deleteTeam(req.user.id, req.params.teamId);

      return res.status(204).send();
    } catch (error: unknown) {
      return handleError(error, res, "Team.delete");
    }
  }

  public async listTeamInvites(req: Request, res: Response) {
    try {
      const invites = await TeamModel.listTeamInvites(
        req.user.id,
        req.params.teamId
      );

      return res.status(200).json(invites);
    } catch (error: unknown) {
      return handleError(error, res, "Team.listTeamInvites");
    }
  }

  public async findTeamByInviteToken(req: Request, res: Response) {
    try {
      const inviteToken = req.query.token;

      if (!inviteToken) {
        throw new AppError("Invite token is required");
      }
      const decodedToken = decodeTokenFromHeader<{
        inviteId: string;
      }>(`Bearer ${inviteToken}`);
      

      const team = await TeamModel.findTeamByInviteCode(
        decodedToken.inviteId,
        req.user.id
      );

      return res.status(200).json(team);
    } catch (error: unknown) {
      return handleError(error, res, "Team.findTeamByInviteToken");
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
      const mailOptions = {
        from: "suporte@recebee.com",
        to: email,
        subject: "Convite para participar de um time",
        html: inviteTemplate({
          inviteToken,
          teamName: invite.team.name,
          invitedBy: req.user.first_name + " " + req.user.last_name,
        }),
      };

      mailTransporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email");

          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      return res.status(201).json({
        message: "Invite sent",
      });
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

  public async removeTeamInvite(req: Request, res: Response) {
    try {
      await TeamModel.removeTeamInvite(
        req.user.id,
        req.params.teamId,
        req.params.inviteId
      );

      return res.status(204).send();
    } catch (error: unknown) {
      return handleError(error, res, "Team.removeTeamInvite");
    }
  }

  public async updateMemberRole(req: Request, res: Response) {
    try {
      await TeamModel.updateMemberRole(
        req.user.id,
        req.params.teamMemberId,
        req.params.teamId,
        req.body.role
      );

      return res.status(200).send();
    } catch (error: unknown) {
      return handleError(error, res, "Team.updateMemberRole");
    }
  }

  public async removeMember(req: Request, res: Response) {
    try {
      await TeamModel.removeTeamMember(
        req.user.id,
        req.params.teamMemberId,
        req.params.teamId
      );
      return res.status(204).send();
    } catch (error: unknown) {
      return handleError(error, res, "Team.removeMember");
    }
  }
}
