"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamSerializer = void 0;
const user_1 = require("./user");
exports.teamSerializer = {
    id: true,
    name: true,
    teamMembers: {
        select: {
            id: true,
            userId: true,
            role: true,
            user: {
                select: user_1.userSerializer,
            },
        },
    },
};
