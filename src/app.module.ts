import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { InvitationModule } from './invitation/invitation.module';
import { CargoModule } from './cargo/cargo.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    InvitationModule,
    CargoModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
