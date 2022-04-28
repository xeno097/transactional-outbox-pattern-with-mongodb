import { Inject, Injectable } from '@nestjs/common';
import { Outbox } from '../database/outbox.schema';
import { Model, Connection } from 'mongoose';
import {
  BaseEvent,
  EVENT_CLIENT_INJECTION_TOKEN,
  IEventPublisher,
  ILogger,
  LOGGER_INJECTION_TOKEN,
} from '../../../../core/lib';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { ConfigKeyEnum } from 'src/config/config-key.enum';

@Injectable()
export class OutboxService {
  private readonly _serviceId: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Outbox.name) private readonly outBoxModel: Model<Outbox>,
    @Inject(EVENT_CLIENT_INJECTION_TOKEN)
    private readonly eventPublisher: IEventPublisher,
    @Inject(LOGGER_INJECTION_TOKEN) private readonly logger: ILogger,
  ) {
    const serviceId = this.configService.get(ConfigKeyEnum.SERVICE_ID);

    if (!serviceId) {
      throw new Error('Service ID is not set');
    }

    this._serviceId = serviceId;

    this._registerEventListener();
  }

  private async _registerEventListener() {
    this.outBoxModel
      .watch([
        {
          $match: {
            operationType: 'insert',
            'fullDocument.metadata.handled': false,
            'fullDocument.metadata.createdBy': this._serviceId,
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
      this.logger.log(`Published event ${JSON.stringify(event, null, 2)}`);

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

  public async sendOutStandingEvents() {
    const events = await this.outBoxModel.find({
      'metadata.handled': false,
    });

    for (const event of events) {
      await this._handleEvent(event);
    }
  }
}
