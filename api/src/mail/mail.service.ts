import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

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
}
