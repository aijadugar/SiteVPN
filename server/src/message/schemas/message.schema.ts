import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ required: true })
  to: string

  @Prop()
  from: string

  @Prop()
  subject: string

  @Prop()
  text: string

  @Prop()
  html: string

  @Prop({ type: Types.ObjectId, ref: 'Mailbox', index: true })
  mailboxId: Types.ObjectId

  createdAt: Date
}

export const MessageSchema = SchemaFactory.createForClass(Message)

MessageSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 1800 },
)