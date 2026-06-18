import { Injectable, OnModuleInit } from '@nestjs/common'
import { SMTPServer } from 'smtp-server'
import { simpleParser } from 'mailparser'
import { MessageService } from '../message/message.service'

@Injectable()
export class SmtpService implements OnModuleInit {
  constructor(private readonly messageService: MessageService) {}

  onModuleInit() {
    const server = new SMTPServer({
      disabledCommands: ['AUTH'], // temp-mail = open relay

      onData: (stream, session, callback) => {
        simpleParser(stream, async (err, parsed) => {
          if (err) return callback(err)

          try {
            await this.messageService.create({
              to: parsed.to?.text || '',
              from: parsed.from?.text || '',
              subject: parsed.subject,
              text: parsed.text,
              html: parsed.html,
            })

            callback()
          } catch (e) {
            callback(e)
          }
        })
      },
    })

    server.listen(2525, () => {
      console.log('📬 SMTP server running on port 2525')
    })
  }
}
