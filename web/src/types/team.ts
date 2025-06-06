import { type User } from "./user";

export type Role = "OWNER" | "ADMIN" | "MEMBER";

export interface Team {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  teamMembers: TeamMember[];
  balance?: number;
  qtTransactions?: number;
  role: Role;
}

export interface TeamMember {
  id: string;
  role: Role;
  userId: string;
  user: User;
}

export interface TeamInvite {
  id: string;
  email: string;
  teamId: string;
  createdAt: string;
  updatedAt: string;
}
