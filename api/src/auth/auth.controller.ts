import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Request } from 'express';
import { AuthGuard } from './auth.guard';
import { MailService } from '../mail/mail.service';
import { PrismaErrorHandler } from 'src/config/prisma-service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const response = await this.authService.register(createUserDto);
      this.mailService
        .sendWelcomeEmail(
          response.user.email,
          response.user.firstName + ' ' + response.user.lastName,
        )
        .then(() => {})
        .catch(() => {});
      return response;
    } catch (error) {
      PrismaErrorHandler(error);
      console.error(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @HttpCode(200)
  async me(@Req() req: Request) {
    const response = await this.authService.me(req.user?.id);
    return response;
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginAuthDto: LoginAuthDto) {
    return await this.authService.login(loginAuthDto);
  }

  @Post('request-password-reset')
  @HttpCode(200)
  async requestPasswordReset(@Body('email') email: string) {
    return await this.authService.requestPasswordReset(email);
  }

  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return await this.authService.resetPassword(token, newPassword);
  }
}
