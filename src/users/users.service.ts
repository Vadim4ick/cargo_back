import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { InvitationService } from 'src/invitation/invitation.service';
import { EditUserDto } from 'src/auth/dto/user.dto';

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

  async getAll() {
    return this.prisma.user.findMany();
  }

  async editById(id: string, editUserDto: EditUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { ...editUserDto },
    });

    return {
      message: 'Пользователь обновлен',
      data: {
        user: updatedUser,
      },
    };
  }

  async removeById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    const deletedUser = await this.prisma.user.delete({ where: { id } });

    return {
      message: 'Пользователь удален',
      data: {
        user: deletedUser,
      },
    };
  }

  async create(
    email: string,
    password: string,
    inviteToken: string,
    username: string,
  ) {
    const invite = await this.invitationService.validateInvite(inviteToken);

    if (invite.email !== email) {
      throw new HttpException('Неверное приглашение', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword, username },
    });

    await this.invitationService.markInviteUsed(inviteToken);

    return { message: 'Регистрация успешна', user };
  }
}
