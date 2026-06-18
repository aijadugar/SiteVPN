import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Mailbox, MailboxSchema } from './schemas/mailbox.schema'
import { MailService } from './mail.service'
import { MailController } from './mail.controller'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Mailbox.name, schema: MailboxSchema }
    ])
  ],
  providers: [MailService],
  controllers: [MailController],
})
export class MailModule {}