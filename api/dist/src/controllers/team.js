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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = void 0;
const handleError_1 = require("../utils/handleError");
const team_1 = require("../model/team");
const jwt_1 = require("../services/jwt");
const appError_1 = require("../utils/appError");
const mailer_client_1 = require("../clients/mailer-client");
const invite_template_1 = require("../templates/invite-template");
class Team {
    constructor() { }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const team = yield team_1.TeamModel.create({
                    name: req.body.name,
                    userId: req.user.id,
                });
                return res.status(201).json(team);
            }
            catch (error) {
                return (0, handleError_1.handleError)(error, res, "Team.create");
            }
        });
    }
    fetchTeams(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const team = yield team_1.TeamModel.findUserTeams(req.user.id);
                return res.status(200).json(team);
            }
            catch (error) {
                return (0, handleError_1.handleError)(error, res, "Team.fetchTeam");
            }
        });
    }
    fetchTeamById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const team = yield team_1.TeamModel.findTeam(req.user.id, req.params.teamId);
                return res.status(200).json(team);
            }
            catch (error) {
                return (0, handleError_1.handleError)(error, res, "Team.fetchTeamById");
            }
        });
    }
    updateTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield team_1.TeamModel.updateTeam(req.user.id, req.params.teamId, req.body);
                return res.status(200).send();
            }
            catch (error) {
                return (0, handleError_1.handleError)(error, res, "Team.update");
            }
        });
    }
    deleteTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield team_1.TeamModel.deleteTeam(req.user.id, req.params.teamId);
                return res.status(204).send();
            }
            catch (error) {
                return (0, handleError_1.handleError)(error, res, "Team.delete");
            }
        });
    }
    listTeamInvites(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const invites = yield team_1.TeamModel.listTeamInvites(req.user.id, req.params.teamId);
                return res.status(200).json(invites);
            }
            catch (error) {
                return (0, handleError_1.handleError)(error, res, "Team.listTeamInvites");
            }
        });
    }
    findTeamByInviteToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const inviteToken = req.query.token;
                if (!inviteToken) {
                    throw new appError_1.AppError("Invite token is required");
                }
                const decodedToken = (0, jwt_1.decodeTokenFromHeader)(`Bearer ${inviteToken}`);
                const team = yield team_1.TeamModel.findTeamByInviteCode(decodedToken.inviteId, req.user.id);
                return res.status(200).json(team);
            }
            catch (error) {
                return (0, handleError_1.handleError)(error, res, "Team.findTeamByInviteToken");
            }
        });
    }
    inviteMember(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, teamId } = req.body;
                const invite = yield team_1.TeamModel.inviteTeamMembers({
                    email,
                    teamId,
                    userId: req.user.id,
                });
                const inviteToken = (0, jwt_1.generateToken)({ inviteId: invite.id });
                const mailOptions = {
                    from: "suporte@recebee.com",
                    to: email,
                    subject: "Convite para participar de um time",
                    html: (0, invite_template_1.inviteTemplate)({
                        inviteToken,
                        teamName: invite.team.name,
                        invitedBy: req.user.first_name + " " + req.user.last_name,
                    }),
                };
                mailer_client_1.mailTransporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log("Error sending email");
                        console.log(error);
                    }
                    else {
                        console.log("Email sent: " + info.response);
                    }
                });
                return res.status(201).json({
                    message: "Invite sent",
                });
            }
            catch (error) {
                return (0, handleError_1.handleError)(error, res, "Team.inviteMember");
            }
        });
    }
    acceptInvite(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const inviteToken = req.query.token;
                if (!inviteToken) {
                    throw new appError_1.AppError("Invite token is required");
                }
                const decodedToken = (0, jwt_1.decodeTokenFromHeader)(`Bearer ${inviteToken}`);
                const invite = yield team_1.TeamModel.acceptInvite(req.user.id, decodedToken.inviteId);
                return res.status(200).json(invite);
            }
            catch (error) {
                return (0, handleError_1.handleError)(error, res, "Team.acceptInvite");
            }
        });
    }
    removeTeamInvite(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield team_1.TeamModel.removeTeamInvite(req.user.id, req.params.teamId, req.params.inviteId);
                return res.status(204).send();
            }
            catch (error) {
                return (0, handleError_1.handleError)(error, res, "Team.removeTeamInvite");
            }
        });
    }
    updateMemberRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield team_1.TeamModel.updateMemberRole(req.user.id, req.params.teamMemberId, req.params.teamId, req.body.role);
                return res.status(200).send();
            }
            catch (error) {
                return (0, handleError_1.handleError)(error, res, "Team.updateMemberRole");
            }
        });
    }
    removeMember(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield team_1.TeamModel.removeTeamMember(req.user.id, req.params.teamMemberId, req.params.teamId);
                return res.status(204).send();
            }
            catch (error) {
                return (0, handleError_1.handleError)(error, res, "Team.removeMember");
            }
        });
    }
}
exports.Team = Team;
