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
import { AuthService } from './auth.service';
import { CreateUserDto, UserDto } from 'src/auth/dto/user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiBody({
    type: UserDto,
    description: 'Данные для входа',
    examples: {
      user1: {
        summary: 'Пример',
        description: 'Авторизация пользователя Vadim',
        value: {
          email: 'firulvv@mail.ru',
          password: '123456',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Успешная авторизация',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неправильный email или пароль',
    schema: {
      example: {
        statusCode: 401,
        message: 'Неправильный email или пароль',
        error: 'Unauthorized',
      },
    },
  })
  @UseGuards(LocalAuthGuard)
  @Post('/auth/login')
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
        description: 'Регистрация пользователя Vadim',
        value: {
          email: 'firulvv@mail.ru',
          password: '123456',
          inviteToken: '123e4567-e89b-12d3-a456-426614174000',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Пользователь существует',
    schema: {
      example: {
        statusCode: 400,
        message: 'Пользователь существует',
      },
    },
  })
  @Post('/auth/register')
  async register(@Body() body: CreateUserDto) {
    return this.authService.register(
      body.email,
      body.password,
      body.inviteToken,
    );
  }

  @ApiOperation({ summary: 'Получение профиля пользователя' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: 'Профиль пользователя',
    type: UserDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
