import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Greeting } from '../database/greeting.schema';
import { GreetingEntity } from './greeting.entity';

@Injectable()
export class GreetingService {
  constructor(
    @InjectModel(Greeting.name) private readonly greetModel: Model<Greeting>,
  ) {}

  async create(greeting: GreetingEntity): Promise<GreetingEntity> {
    const createdGreet = new this.greetModel(greeting);

    await createdGreet.save();

    return greeting;
  }
}
