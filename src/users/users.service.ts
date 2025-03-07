import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { InvitationService } from 'src/invitation/invitation.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private invitationService: InvitationService,
  ) {}

  async findOne(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(email: string, password: string, inviteToken: string) {
    const invite = await this.invitationService.validateInvite(inviteToken);

    if (invite.email !== email) {
      throw new HttpException('Неверное приглашение', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword },
    });

    await this.invitationService.markInviteUsed(inviteToken);

    return { message: 'Регистрация успешна', user };
  }
}
