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
import { ExpensesService, MappedData } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Request } from 'express';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post(':teamId/import')
  async import(
    @Req() req: Request,
    @Body() importExpenseDto: MappedData[],
    @Param('teamId') teamId: string,
  ) {
    return await this.expensesService.import(
      req.user.id,
      teamId,
      importExpenseDto,
    );
  }

  @Post()
  async create(
    @Req() req: Request,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    return await this.expensesService.create(req.user.id, createExpenseDto);
  }

  @Get(':teamId')
  async findAll(
    @Req() req: Request,
    @Param('teamId') teamId: string,
    @Query('date') date: string,
  ) {
    return await this.expensesService.findAll(req.user.id, teamId, date);
  }

  @Patch(':teamId/:expenseId')
  async update(
    @Req() req: Request,
    @Param('teamId') teamId: string,
    @Param('expenseId') expenseId: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return await this.expensesService.update({
      userId: req.user.id,
      teamId,
      expenseId,
      updateExpenseDto,
    });
  }

  @Delete(':teamId/:expenseId')
  async remove(
    @Req() req: Request,
    @Param('teamId') teamId: string,
    @Param('expenseId') expenseId: string,
  ) {
    return await this.expensesService.remove(req.user.id, teamId, expenseId);
  }

  @Delete(':teamId/batch/:batchId')
  async removeByBatch(
    @Req() req: Request,
    @Param('teamId') teamId: string,
    @Param('batchId') batchId: string,
  ) {
    return await this.expensesService.removeByBatchId(
      req.user.id,
      teamId,
      batchId,
    );
  }
}
