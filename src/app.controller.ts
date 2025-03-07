import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

class LoginDto {
  username: string;
  password: string;
}

@ApiTags('Authentication')
@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiBody({
    type: LoginDto,
    description: 'Данные для входа',
    examples: {
      user1: {
        summary: 'Пример 1 (John)',
        description: 'Авторизация пользователя John',
        value: {
          username: 'john',
          password: 'changeme',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Успешная авторизация',
    type: Object,
  })
  @ApiResponse({ status: 401, description: 'Ошибка авторизации' })
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Получение профиля пользователя' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Профиль пользователя' })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
