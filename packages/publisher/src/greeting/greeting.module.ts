import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GreetingRestController } from './api/greeting.rest.controller';
import { Greeting, GreetingSchema } from './database/greeting.schema';
import { GreetingService } from './service/greeting.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Greeting.name,
        schema: GreetingSchema,
      },
    ]),
  ],
  providers: [GreetingService],
  controllers: [GreetingRestController],
})
export class GreetingModule {}
