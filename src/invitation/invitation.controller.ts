import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InvitationService } from './invitation.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UserDto } from 'src/auth/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('invitation')
export class InvitationController {
  constructor(
    private readonly invitationService: InvitationService,
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Генерация приглашения (только для SuperAdmin)' })
  @ApiBody({
    type: UserDto,
    description: 'Данные для входа',
    examples: {
      user1: {
        summary: 'Пример',
        description: 'Генерация приглашения Vadim',
        value: {
          email: 'vadim@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Приглашение успешно отправлено',
    example: {
      inviteLink:
        'http://localhost:3000/auth/register?token=5c2f489d-e2ff-4ad0-8ac0-662e220a8609',
      message: 'Новое приглашение создано',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован',
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles('SUPERADMIN')
  @Post('invite')
  async generateInvite(@Body('email') email: string) {
    const user = await this.usersService.findOne(email);

    if (user) {
      throw new HttpException(
        'Пользователь уже зарегистрирован',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.invitationService.generateInvite(email);
  }
}
