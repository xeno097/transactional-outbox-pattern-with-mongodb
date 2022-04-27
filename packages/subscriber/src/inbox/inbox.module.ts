import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Inbox, InboxSchema } from './database/inbox.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Inbox.name,
        schema: InboxSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class InboxModule {}
