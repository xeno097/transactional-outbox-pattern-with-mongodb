import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { ConfigKeyEnum } from 'src/config/config-key.enum';
import { Outbox } from 'src/outbox/database/outbox.schema';
import { CreatedGreetingEvent } from '../../../../core/lib';
import { Greeting } from '../database/greeting.schema';
import { GreetingEntity } from './greeting.entity';

@Injectable()
export class GreetingService {
  private readonly _serviceId: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Greeting.name) private readonly greetModel: Model<Greeting>,
    @InjectModel(Outbox.name) private readonly outBoxModel: Model<Outbox>,
  ) {
    const id = this.configService.get<string>(ConfigKeyEnum.SERVICE_ID);

    if (!id) {
      throw new Error('Service ID is not set');
    }

    this._serviceId = id;
  }

  async create(greeting: GreetingEntity): Promise<GreetingEntity> {
    const session = await this.connection.startSession();

    session.startTransaction();
    try {
      const createdGreet = new this.greetModel(greeting);

      const event = new CreatedGreetingEvent(greeting, {
        createdBy: this._serviceId,
      });

      const outbox = new this.outBoxModel(event);

      await Promise.all([
        createdGreet.save({ session }),
        outbox.save({ session }),
      ]);

      await session.commitTransaction();

      return greeting;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
