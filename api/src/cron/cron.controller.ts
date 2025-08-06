import { Controller, Post } from '@nestjs/common';
import { CronService } from './cron.service';

@Controller('cron')
export class CronController {
  constructor(private readonly cron: CronService) {}

  @Post('/daily-tasks')
  async create() {
    await this.cron.processOverdueExpenses();
    await this.cron.notifyExpensesCloseToDue();
    return { message: 'Cron tasks executed successfully' };
  }
}
