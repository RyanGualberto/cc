import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

export function PrismaErrorHandler(error: unknown) {
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new BadRequestException({
          message: `A chave(s) única(s) [${
            (
              error.meta as {
                target: string;
              }
            ).target
          }] já estão sendo utilizada(s)`,
        });
      case 'P2025':
        throw new NotFoundException({
          message: error.message,
        });
      default:
        console.error(error);
        throw new InternalServerErrorException({
          message: 'Erro ao completar a operação',
          error: error,
        });
    }
  }

  if (error instanceof PrismaClientValidationError) {
    throw new UnprocessableEntityException({
      message: 'Preencha os campos corretamente',
    });
  }

  throw new InternalServerErrorException({
    message: 'Erro ao completar a operação',
    error: error,
  });
}
