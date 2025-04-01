import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(email: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Seja Bem vindo à Melinha Açaíteria!',
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
}
