import { userSerializer } from "./user";

export const teamSerializer = {
  id: true,
  name: true,
  teamMembers: {
    select: {
      id: true,
      userId: true,
      role: true,
      user: {
        select: userSerializer,
      },
    },
  },
};
