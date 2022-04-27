import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Greeting extends Document {
  @Prop({
    required: true,
    unique: true,
  })
  id: string;

  @Prop({
    required: true,
    minlength: 3,
    maxlength: 25,
  })
  text: string;

  @Prop({
    required: true,
  })
  createdAt: string;
}

export const GreetingSchema = SchemaFactory.createForClass(Greeting);
