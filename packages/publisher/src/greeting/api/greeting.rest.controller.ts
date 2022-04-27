import { Body, Controller, Param, Post } from '@nestjs/common';
import { GreetingEntity } from '../service/greeting.entity';
import { GreetingService } from '../service/greeting.service';

@Controller('greeting')
export class GreetingRestController {
  constructor(private readonly service: GreetingService) {}

  @Post()
  public async create(@Body('text') text: string): Promise<GreetingEntity> {
    const greet = new GreetingEntity(text);

    return this.service.create(greet);
  }
}
