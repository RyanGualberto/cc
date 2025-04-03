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
} from '@nestjs/common';
import { ExpenseCategoriesService } from './expense-categories.service';
import { CreateExpenseCategoryDto } from './dto/create-expense-category.dto';
import { UpdateExpenseCategoryDto } from './dto/update-expense-category.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('expense-categories')
export class ExpenseCategoriesController {
  constructor(
    private readonly expenseCategoriesService: ExpenseCategoriesService,
  ) {}

  @Post('/teams/:teamId')
  create(
    @Param('teamId') teamId: string,
    @Req() req: Request,
    @Body() createExpenseCategoryDto: CreateExpenseCategoryDto,
  ) {
    createExpenseCategoryDto.teamId = teamId;
    return this.expenseCategoriesService.create(
      req.user.id,
      createExpenseCategoryDto,
    );
  }

  @Get('/teams/:teamId')
  findOne(@Req() req: Request, @Param('teamId') teamId: string) {
    return this.expenseCategoriesService.findAll(req.user.id, teamId);
  }

  @Patch('/teams/:teamId/:id')
  update(
    @Param('teamId') teamId: string,
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateExpenseCategoryDto: UpdateExpenseCategoryDto,
  ) {
    updateExpenseCategoryDto.teamId = teamId;
    return this.expenseCategoriesService.update(
      id,
      req.user.id,
      updateExpenseCategoryDto,
    );
  }

  @Delete('/teams/:teamId/:id')
  remove(
    @Req() req: Request,
    @Param('teamId') teamId: string,
    @Param('id') id: string,
  ) {
    return this.expenseCategoriesService.remove(id, teamId, req.user.id);
  }
}
