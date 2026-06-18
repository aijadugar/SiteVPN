import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ timestamps: true })
export class Mailbox extends Document {
  @Prop({ unique: true })
  email: string

  @Prop({ unique: true })
  token: string

  @Prop({
    type: Date,
    index: { expires: 3600 },
  })
  expiresAt: Date
}

export const MailboxSchema = SchemaFactory.createForClass(Mailbox)