import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class InvitationService {
  constructor(private prisma: PrismaService) {}

  async generateInvite(email: string) {
    const existingInvite = await this.prisma.invitation.findUnique({
      where: { email },
    });

    if (existingInvite && !existingInvite.used) {
      return {
        inviteLink: `${process.env.CLIENT_URI}/auth/register?token=${existingInvite.token}`,
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

    return {
      inviteLink: `${process.env.CLIENT_URI}/auth/register?token=${token}`,
      message: existingInvite
        ? 'Приглашение обновлено'
        : 'Новое приглашение создано',
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
