import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';
import { PrismaService } from '../config/prisma-service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private mailService: MailService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      cpf: createUserDto.cpf,
      email: createUserDto.email,
      password: createUserDto.password || '',
      phone: createUserDto.phone,
    });

    return {
      ...user,
      token: await this.generateToken(user),
    };
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.usersService.findByCpf(loginAuthDto.cpf);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordMatch = await this.usersService.comparePassword(
      loginAuthDto.password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    delete user.password;

    return {
      ...user,
      token: await this.generateToken(user),
    };
  }

  async me(id: string) {
    const user = await this.usersService.findOne(id);
    return user;
  }

  async requestPasswordReset(cpf: string) {
    const user = await this.usersService.findByCpf(cpf);

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000);

    await this.prismaService.user.update({
      where: { cpf },
      data: { resetToken, resetExpires },
    });

    await this.mailService.sendPasswordResetEmail(
      user.email,
      user.firstName + ' ' + user.lastName,
      resetToken,
    );

    return { message: 'E-mail de redefinição enviado.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prismaService.user.findFirst({
      where: { resetToken: token, resetExpires: { gt: new Date() } },
    });

    if (!user) {
      throw new BadRequestException('Token inválido ou expirado.');
    }

    const salt = crypto.randomInt(0, 10);
    const hashed_password = await bcrypt.hash(newPassword, salt);

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { password: hashed_password, resetToken: null, resetExpires: null },
    });

    return { message: 'Senha redefinida com sucesso.' };
  }

  async oauth(payload: {
    email: string;
    firstName?: string;
    lastName?: string;
  }) {
    const { email, firstName = '', lastName = '' } = payload;

    const user: User | null = await this.usersService.findByEmail(email);

    if (user) {
      // usuário já existe -> retornar token
      return {
        ...user,
        token: await this.generateToken(user),
      };
    }

    // usuário não existe -> sinalizar que é necessário completar o perfil
    return {
      needsProfileCompletion: true,
      email,
      firstName: firstName || email.split('@')[0],
      lastName: lastName || '',
    };
  }

  private async generateToken(user: User) {
    const payload = { sub: user.id, user };
    return await this.jwtService.signAsync(payload, {
      privateKey: String(process.env.JWT_SECRET),
      expiresIn: '30d',
    });
  }
}
