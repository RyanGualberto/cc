import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ExpensePaymentMethodsService } from './expense-payment-methods.service';
import { CreateExpensePaymentMethodDto } from './dto/create-expense-payment-method.dto';
import { UpdateExpensePaymentMethodDto } from './dto/update-expense-payment-method.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('expense-payment-methods')
export class ExpensePaymentMethodsController {
  constructor(
    private readonly expensePaymentMethodsService: ExpensePaymentMethodsService,
  ) {}

  @Post('/teams/:teamId')
  create(
    @Param('teamId') teamId: string,
    @Req() req: Request,
    @Body() createExpensePaymentMethodDto: CreateExpensePaymentMethodDto,
  ) {
    createExpensePaymentMethodDto.teamId = teamId;
    return this.expensePaymentMethodsService.create(
      req.user.id,
      createExpensePaymentMethodDto,
    );
  }

  @Get('/teams/:teamId')
  findOne(
    @Req() req: Request,
    @Param('teamId') teamId: string,
    @Query('date') date?: string,
  ) {
    return this.expensePaymentMethodsService.findAll(req.user.id, teamId, date);
  }

  @Patch('/teams/:teamId/:id')
  update(
    @Param('teamId') teamId: string,
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateExpensePaymentMethodDto: UpdateExpensePaymentMethodDto,
  ) {
    updateExpensePaymentMethodDto.teamId = teamId;
    return this.expensePaymentMethodsService.update(
      id,
      req.user.id,
      updateExpensePaymentMethodDto,
    );
  }

  @Delete('/teams/:teamId/:id')
  remove(
    @Req() req: Request,
    @Param('teamId') teamId: string,
    @Param('id') id: string,
  ) {
    return this.expensePaymentMethodsService.remove(id, teamId, req.user.id);
  }
}
