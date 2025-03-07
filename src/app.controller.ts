import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CreateUserDto, UserDto } from './users/dto/user.dto';

@ApiTags('Authentication')
@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiBody({
    type: UserDto,
    description: 'Данные для входа',
    examples: {
      user1: {
        summary: 'Пример 1 (John)',
        description: 'Авторизация пользователя John',
        value: {
          email: 'john',
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

  @ApiOperation({ summary: 'Регистрация' })
  @ApiBody({
    type: UserDto,
    description: 'Данные для регистрации',
    examples: {
      user1: {
        summary: 'Пример',
        description: 'Регистрация пользователя John',
        value: {
          email: 'Vadim',
          password: 'changeme',
        },
      },
    },
  })
  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return this.authService.register(body.email, body.password);
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
