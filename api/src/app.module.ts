import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { TeamsModule } from './teams/teams.module';
import { ExpenseCategoriesModule } from './expense-categories/expense-categories.module';
import { RevenueCategoriesModule } from './revenue-categories/revenue-categories.module';
import { ExpensesModule } from './expenses/expenses.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
      defaults: {
        from: '"Recebee" <no-reply@recebee.com>',
      },
      template: {
        dir: join(__dirname, '..', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    TeamsModule,
    ExpenseCategoriesModule,
    RevenueCategoriesModule,
    ExpensesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
