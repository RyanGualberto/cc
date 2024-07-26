import { Router } from "express";
import { Team as TeamController } from "../controllers/team";

const router = Router();
const teamController = new TeamController();

router.post("/", teamController.create);
router.get("/", teamController.fetchTeams);
router.get("/:teamId", teamController.fetchTeamById);
router.delete("/:teamId/members/:teamMemberId", teamController.removeMember);
router.put("/:teamId/members/:teamMemberId", teamController.updateMemberRole);
router.post("/invites/create", teamController.inviteMember);
router.post("/invites/accept", teamController.acceptInvite);

export { router as teamRouter };
