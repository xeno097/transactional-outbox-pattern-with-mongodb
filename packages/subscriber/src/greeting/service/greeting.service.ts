import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Inbox } from 'src/inbox/database/inbox.schema';
import { CreatedGreetingEvent } from '../../../../core/lib';

@Injectable()
export class GreetingService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Inbox.name) private readonly inboxModel: Model<Inbox>,
  ) {}

  public async createdGreeting(event: CreatedGreetingEvent) {
    const session = await this.connection.startSession();

    session.startTransaction();

    try {
      // Verify if the incoming event is already in the inbox
      const checkInbox = await this.inboxModel.findOne({ id: event.id }, null, {
        session,
      });

      if (checkInbox) {
        return;
      }

      const inbox = new this.inboxModel(event);

      await inbox.save({ session });

      await session.commitTransaction();

      return;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
