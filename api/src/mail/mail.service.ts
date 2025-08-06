import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { $Enums, Expense } from '@prisma/client';

interface ExpenseWithTeam extends Expense {
  team: {
    teamMembers: ({
      user: {
        email: string;
        firstName: string;
        lastName: string;
      };
    } & {
      id: string;
      teamId: string;
      userId: string;
      createdAt: Date;
      updatedAt: Date;
      role: $Enums.TeamMemberRole;
    })[];
  } & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
  };
}

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(email: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Seja Bem vindo ao Recebee!',
        template: 'welcome',
        context: {
          name,
        },
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }

  async sendPasswordResetEmail(email: string, name: string, token: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Redefinição de senha',
        template: 'reset-password',
        context: {
          clientName: name,
          token,
        },
      });
    } catch (error) {
      console.error('Error sending password reset email:', error);
    }
  }

  async sendTeamInvite(email: string, teamName: string, token: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Convite Para Espaço Financeiro',
        template: 'team-invite',
        context: {
          teamName,
          token,
        },
      });
    } catch (error) {
      console.error('Error sending team invite:', error);
    }
  }

  async sendOverdueNotifications(overdueExpenses: ExpenseWithTeam[]) {
    try {
      const emails = overdueExpenses
        .map((expense) =>
          expense.team.teamMembers.map((member) => member.user.email),
        )
        .flat();
      const uniqueEmails = Array.from(new Set(emails));

      for (const email of uniqueEmails) {
        const expensesByEmail = overdueExpenses.filter((expense) =>
          expense.team.teamMembers.some(
            (member) => member.user.email === email,
          ),
        );
        await this.mailerService
          .sendMail({
            to: email,
            subject: 'Despesas Vencidas',
            template: 'overdue-notification',
            context: {
              teamId: expensesByEmail[0].team.id,
              teamName: expensesByEmail[0].team.name,
              expenses: expensesByEmail.map((expense) => ({
                title: expense.title,
                amountInCents: (expense.amountInCents / 100).toLocaleString(
                  'pt-BR',
                  {
                    style: 'currency',
                    currency: 'BRL',
                  },
                ),
                date: expense.date.toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                }),
              })),
            },
          })
          .then(() => {
            console.log(`Overdue notifications sent to ${email}`);
          })
          .catch((error) => {
            console.error(
              `Error sending overdue notifications to ${email}:`,
              error,
            );
          });
      }
    } catch (error) {
      console.error('Error sending overdue notifications:', error);
    }
  }

  async sendExpenseCloseToDueNotifications(
    closeToDueExpenses: ExpenseWithTeam[],
  ) {
    try {
      const emails = closeToDueExpenses
        .map((expense) =>
          expense.team.teamMembers.map((member) => member.user.email),
        )
        .flat();
      const uniqueEmails = Array.from(new Set(emails));

      for (const email of uniqueEmails) {
        const expensesByEmail = closeToDueExpenses.filter((expense) =>
          expense.team.teamMembers.some(
            (member) => member.user.email === email,
          ),
        );
        await this.mailerService
          .sendMail({
            to: email,
            subject: 'Despesas Próximas do Vencimento',
            template: 'close-to-due-notification',
            context: {
              teamId: expensesByEmail[0].team.id,
              teamName: expensesByEmail[0].team.name,
              expenses: expensesByEmail.map((expense) => ({
                title: expense.title,
                amountInCents: (expense.amountInCents / 100).toLocaleString(
                  'pt-BR',
                  {
                    style: 'currency',
                    currency: 'BRL',
                  },
                ),
                date: expense.date.toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                }),
              })),
            },
          })
          .then(() => {
            console.log(`Close to due notifications sent to ${email}`);
          })
          .catch((error) => {
            console.error(
              `Error sending close to due notifications to ${email}:`,
              error,
            );
          });
      }
    } catch (error) {
      console.error('Error sending close to due notifications:', error);
    }
  }
}
