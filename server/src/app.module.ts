import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MailModule } from './mail/mail.module'
import { MessageModule } from './message/message.module';
import { SmtpModule } from './smtp/smtp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,      // available everywhere
      envFilePath: '.env', // loads local .env
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGODB_URI') ||
          process.env.MONGODB_URI,
      }),
    }),
    MailModule,
    MessageModule,
    SmtpModule,
  ],
})
export class AppModule {}