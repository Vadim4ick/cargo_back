import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
  Res,
  Req,
  UnauthorizedException,
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
import { Request as ExpressRequest, Response } from 'express';

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
        message: 'Успешная авторизация',
        data: {
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
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
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const { refresh_token, access_token } = await this.authService.login(
      req.user,
    );

    // res.cookie('refresh_token', refresh_token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    // });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
      path: '/',
      domain: '.myakos.ru', // ✅ обязательное условие для работы на поддоменах
    });

    return {
      data: {
        access_token,
      },
      message: 'Успешная авторизация',
    };
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
      body.username,
    );
  }

  @ApiOperation({ summary: 'Обновление access token с помощью refresh token' })
  @ApiBody({
    description: 'Refresh token для обновления access token',
    schema: {
      example: {
        refresh_token: 'ваш_refresh_token',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Новый access token',
    schema: {
      example: {
        access_token: 'новый_access_token',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неверный или просроченный refresh token',
  })
  @Post('/auth/refresh')
  async refresh(@Req() req: ExpressRequest) {
    const refreshToken =
      req.cookies['refresh_token'] ?? req.headers['cookie'].split(' ')[1];

    if (!refreshToken) {
      throw new UnauthorizedException('Рефреш токен отсутствует');
    }

    return this.authService.refresh(refreshToken);
  }

  @ApiOperation({ summary: 'Выход пользователя и удаление токенов' })
  @ApiResponse({
    status: 200,
    description: 'Успешный выход',
    schema: {
      example: { message: 'Вы успешно вышли' },
    },
  })
  @Post('/auth/logout')
  async logout(
    @Req() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('refresh_token', { domain: '.myakos.ru', path: '/' });

    return { message: 'Вы успешно вышли' };
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
    return this.authService.getProfile(req.user.email);
  }
}
