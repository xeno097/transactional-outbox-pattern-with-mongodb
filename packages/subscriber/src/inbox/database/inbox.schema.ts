import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEvent, EventMetadata } from '../../../../core/lib';

@Schema()
export class Inbox extends Document implements BaseEvent {
  @Prop({
    unique: true,
    required: true,
  })
  id: string;

  @Prop({
    required: true,
  })
  type: string;

  @Prop({
    type: Object,
    required: true,
  })
  payload: Object;

  @Prop({
    required: true,
  })
  createdAt: string;

  @Prop({
    required: true,
    type: EventMetadata,
  })
  metadata: EventMetadata;
}

export const InboxSchema = SchemaFactory.createForClass(Inbox);
