import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma.service';
import { InvitationService } from 'src/invitation/invitation.service';

@Module({
  providers: [UsersService, PrismaService, InvitationService],
  exports: [UsersService],
})
export class UsersModule {}
