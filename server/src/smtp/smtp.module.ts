import { Module } from '@nestjs/common'
import { SmtpService } from './smtp.service'
import { MessageModule } from '../message/message.module'

@Module({
  imports: [MessageModule],
  providers: [SmtpService],
})
export class SmtpModule {}
