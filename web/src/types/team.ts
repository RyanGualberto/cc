import { type User } from "./user";

export type Role = "OWNER" | "ADMIN" | "MEMBER";

export interface Team {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  teamMembers: TeamMember[];
  role: Role;
}

export interface TeamMember {
  role: Role;
  userId: string;
  user: User;
}
