import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Inbox } from 'src/inbox/database/inbox.schema';
import {
  CreatedGreetingEvent,
  ILogger,
  LOGGER_INJECTION_TOKEN,
} from '../../../../core/lib';

@Injectable()
export class GreetingService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Inbox.name) private readonly inboxModel: Model<Inbox>,
    @Inject(LOGGER_INJECTION_TOKEN) private readonly logger: ILogger,
  ) {}

  public async createdGreeting(event: CreatedGreetingEvent) {
    const session = await this.connection.startSession();

    session.startTransaction();

    try {
      this.logger.log('Received event: ' + JSON.stringify(event, null, 2));

      // Verify if the incoming event is already in the inbox
      const checkInbox = await this.inboxModel.findOne({ id: event.id }, null, {
        session,
      });

      if (checkInbox) {
        this.logger.log('Event already in the inbox');
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
