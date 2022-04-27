import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import {
  CreatedGreetingEvent,
  CREATED_GREETING_EVENT,
} from '../../../../core/lib';
import { GreetingService } from '../service/greeting.service';

@Controller('greeting')
export class GreetingMessageController {
  constructor(private readonly service: GreetingService) {}

  @EventPattern({ type: CREATED_GREETING_EVENT })
  public async createdGreeting(event: CreatedGreetingEvent) {
    await this.service.createdGreeting(event);
  }
}
