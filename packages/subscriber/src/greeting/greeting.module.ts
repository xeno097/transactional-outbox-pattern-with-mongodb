import { Module } from '@nestjs/common';
import { GreetingMessageController } from './api/greeting.message.controller';
import { GreetingService } from './service/greeting.service';

@Module({
  providers: [GreetingService],
  controllers: [GreetingMessageController],
})
export class GreetingModule {}
