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
import { RevenueCategoriesService } from './revenue-categories.service';
import { CreateRevenueCategoryDto } from './dto/create-revenue-category.dto';
import { UpdateRevenueCategoryDto } from './dto/update-revenue-category.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('revenue-categories')
export class RevenueCategoriesController {
  constructor(
    private readonly revenueCategoriesService: RevenueCategoriesService,
  ) {}

  @Post('/teams/:teamId')
  create(
    @Param('teamId') teamId: string,
    @Req() req: Request,
    @Body() createRevenueCategoryDto: CreateRevenueCategoryDto,
  ) {
    createRevenueCategoryDto.teamId = teamId;
    return this.revenueCategoriesService.create(
      req.user.id,
      createRevenueCategoryDto,
    );
  }

  @Get('/teams/:teamId')
  findOne(
    @Req() req: Request,
    @Param('teamId') teamId: string,
    @Query('date') date?: string,
  ) {
    return this.revenueCategoriesService.findAll(req.user.id, teamId, date);
  }

  @Patch('/teams/:teamId/:id')
  update(
    @Param('teamId') teamId: string,
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateRevenueCategoryDto: UpdateRevenueCategoryDto,
  ) {
    updateRevenueCategoryDto.teamId = teamId;
    return this.revenueCategoriesService.update(
      id,
      req.user.id,
      updateRevenueCategoryDto,
    );
  }

  @Delete('/teams/:teamId/:id')
  remove(
    @Req() req: Request,
    @Param('teamId') teamId: string,
    @Param('id') id: string,
  ) {
    return this.revenueCategoriesService.remove(id, teamId, req.user.id);
  }
}
