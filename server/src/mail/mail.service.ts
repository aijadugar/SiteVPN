import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Mailbox } from './schemas/mailbox.schema'
import { randomUUID } from 'crypto'

@Injectable()
export class MailService {
  constructor(
    @InjectModel(Mailbox.name)
    private mailboxModel: Model<Mailbox>,
  ) {}

  async createTempMailbox() {
    const email = this.generateEmail()
    const token = randomUUID()

    const mailbox = await this.mailboxModel.create({
      email,
      token,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 mins
    })

    return {
      email: mailbox.email,
      token: mailbox.token,
    }
  }

  private generateEmail(): string {
    const random = Math.random().toString(36).substring(2, 12)
    return `${random}@sitevpn.me`
  }
}