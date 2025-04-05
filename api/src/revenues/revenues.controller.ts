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
import { RevenuesService } from './revenues.service';
import { CreateRevenueDto } from './dto/create-revenue.dto';
import { Request } from 'express';
import { UpdateRevenueDto } from './dto/update-revenue.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('revenues')
export class RevenuesController {
  constructor(private readonly revenuesService: RevenuesService) {}

  @Post()
  async create(
    @Req() req: Request,
    @Body() createRevenueDto: CreateRevenueDto,
  ) {
    return await this.revenuesService.create(req.user.id, createRevenueDto);
  }

  @Get(':teamId')
  async findAll(
    @Req() req: Request,
    @Param('teamId') teamId: string,
    @Query('date') date: string,
  ) {
    return await this.revenuesService.findAll(req.user.id, teamId, date);
  }

  @Patch(':teamId/:revenueId')
  async update(
    @Req() req: Request,
    @Param('teamId') teamId: string,
    @Param('revenueId') revenueId: string,
    @Body() updateRevenueDto: UpdateRevenueDto,
  ) {
    return await this.revenuesService.update(
      req.user.id,
      teamId,
      revenueId,
      updateRevenueDto,
    );
  }

  @Delete(':teamId/:revenueId')
  async remove(
    @Req() req: Request,
    @Param('teamId') teamId: string,
    @Param('revenueId') revenueId: string,
  ) {
    return await this.revenuesService.remove(req.user.id, teamId, revenueId);
  }

  @Delete(':teamId/batch/:batchId')
  async removeByBatch(
    @Req() req: Request,
    @Param('teamId') teamId: string,
    @Param('batchId') batchId: string,
  ) {
    return await this.revenuesService.removeByBatchId(
      req.user.id,
      teamId,
      batchId,
    );
  }
}
