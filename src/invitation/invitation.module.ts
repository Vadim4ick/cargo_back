import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [InvitationController],
  providers: [InvitationService, PrismaService, UsersService],
  exports: [InvitationService],
})
export class InvitationModule {}
