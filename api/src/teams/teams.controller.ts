import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  async create(
    @Req() req: Express.Request,

    @Body() createTeamDto: CreateTeamDto,
  ) {
    return await this.teamsService.create({
      ...createTeamDto,
      userId: req.user.id,
    });
  }

  @Get()
  async findAll(@Req() req: Express.Request) {
    return await this.teamsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Req() req: Express.Request, @Param('id') id: string) {
    return this.teamsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Req() req: Express.Request,
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamsService.update(id, req.user.id, updateTeamDto);
  }

  @Delete(':id')
  remove(@Req() req: Express.Request, @Param('id') id: string) {
    return this.teamsService.remove(id, req.user.id);
  }
}
