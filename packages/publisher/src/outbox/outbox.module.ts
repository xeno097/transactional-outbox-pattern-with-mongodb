import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Outbox, OutboxSchema } from './database/outbox.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Outbox.name,
        schema: OutboxSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class OutboxModule {}
