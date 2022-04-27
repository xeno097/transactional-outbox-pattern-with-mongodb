import { Inject, Injectable } from '@nestjs/common';
import { Outbox } from '../database/outbox.schema';
import { Model, Connection } from 'mongoose';
import {
  BaseEvent,
  EVENT_CLIENT_INJECTION_TOKEN,
  IEventPublisher,
} from '../../../../core/lib';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OutboxService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Outbox.name) private readonly outBoxModel: Model<Outbox>,
    @Inject(EVENT_CLIENT_INJECTION_TOKEN)
    private readonly eventPublisher: IEventPublisher,
  ) {
    this._registerEventListener();
  }

  private async _registerEventListener() {
    this.outBoxModel
      .watch([
        {
          $match: {
            operationType: 'insert',
          },
        },
      ])
      .on('change', async (event) => {
        const { fullDocument } = event;

        await this._handleEvent(fullDocument);
      });
  }

  private async _handleEvent(event: BaseEvent) {
    const session = await this.connection.startSession();

    session.startTransaction();
    try {
      await this.eventPublisher.publish(event.type, event);

      await this.outBoxModel.updateOne(
        {
          id: event.id,
        },
        {
          $set: {
            'metadata.handled': true,
          },
        },
        { session },
      );

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
