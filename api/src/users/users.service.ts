import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../config/prisma-service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    const salt = crypto.randomInt(0, 10);
    const hashed_password = await bcrypt.hash(data.password, salt);

    const record = await this.prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        password: hashed_password,
        cpf: data.cpf,
      },
    });

    delete (record as Partial<User>).password;
    return record;
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      omit: {
        password: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const usersWithoutEmail = users.map((user) => ({
      ...user,
      email: this.maskEmail(user.email),
    }));

    return usersWithoutEmail;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      omit: {
        password: true,
      },
    });

    return { ...user, email: this.maskEmail(user.email) };
  }

  async findByCpf(cpf: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { cpf: cpf },
    });
    if (!record) return null;

    return record;
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!record) return null;

    return record;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const record = await this.prisma.user.update({
      where: { id: id },
      data: updateUserDto,
    });

    return record;
  }

  async remove(id: string) {
    return await this.prisma.user.delete({
      where: { id: id },
    });
  }

  async comparePassword(plainText: string, hashedPassword: string) {
    return await bcrypt.compare(plainText, hashedPassword);
  }

  private maskEmail(email: string) {
    const emailParts = email.split('@');
    const maskedEmail = `${emailParts[0].slice(0, 3)}${emailParts[0]
      .slice(3, -3)
      .replace(/./g, '*')}@${emailParts[1]}`;

    return maskedEmail;
  }
}
