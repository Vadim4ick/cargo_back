import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { randomUUID } from 'crypto';
import { MailerService } from 'src/mail/mail.service';
import { InvitationDto } from './dto/invitation.dto';

@Injectable()
export class InvitationService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
  ) {}

  async generateInvite(invitationDto: InvitationDto) {
    const { email } = invitationDto;

    const existingInvite = await this.prisma.invitation.findUnique({
      where: { email },
    });

    if (existingInvite && !existingInvite.used) {
      return {
        inviteLink: `${process.env.CLIENT_URI}/register?token=${existingInvite.token}`,
        message: 'Приглашение уже было создано ранее',
      };
    }

    // Генерируем новый токен
    const token = randomUUID();

    // Если приглашение было использовано, обновляем его, иначе создаём новое
    if (existingInvite) {
      await this.prisma.invitation.update({
        where: { email },
        data: { token, used: false },
      });
    } else {
      await this.prisma.invitation.create({
        data: { email, token },
      });
    }

    const inviteLink = `${process.env.CLIENT_URI}/register?token=${token}`;

    // Отправляем письмо с приглашением
    await this.mailerService.sendInvitation(email, inviteLink);

    return {
      inviteLink,
      message: 'Новое приглашение создано и отправлено на почту',
    };
  }

  async validateInvite(token: string) {
    const invite = await this.prisma.invitation.findUnique({
      where: { token },
    });

    if (!invite || invite.used) {
      throw new NotFoundException(
        'Приглашение не найдено или уже использовано',
      );
    }

    return invite;
  }

  async markInviteUsed(token: string) {
    await this.prisma.invitation.update({
      where: { token },
      data: { used: true },
    });
  }
}
