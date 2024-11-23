"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inviteTemplate = void 0;
const inviteTemplate = ({ teamName, inviteToken, invitedBy, }) => {
    return `
    <html
      lang="pt-br"
    >
    <body>
        <div
            style="
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 5px;
            "
        >
            <h3>
              Convidado para o time ${teamName}
            </h3>
            <p
              style="
                  margin: 12px 0;
              "
            >
              Você foi convidado por ${invitedBy} para participar do time ${teamName}. Clique no botão abaixo para aceitar o convite.
            </p>
            <a
              style="
                  background-color: hsl(222.2, 47.4%, 11.2%);
                  color: #fff;
                  text-decoration: none;
                  padding: 10px 20px;
                  border-radius: 5px;
                  display: block;
                  text-align: center;
              "
              href="${process.env.NEXT_APP_URL}/invite?token=${inviteToken}"
            >
              Aceitar convite
            </a>
        </div>
    </body
    </html>
    `;
};
exports.inviteTemplate = inviteTemplate;
