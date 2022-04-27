import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Outbox, OutboxSchema } from './database/outbox.schema';
import { OutboxService } from './service/outbox.service';

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
  providers: [OutboxService],
  exports: [MongooseModule],
})
export class OutboxModule {}
