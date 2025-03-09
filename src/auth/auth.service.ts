/* eslint-disable @typescript-eslint/no-unused-vars */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/auth/dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async refresh(refreshToken: string) {
    try {
      // Проверяем refresh token с использованием отдельного секрета
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      // Опционально: проверить, что refresh token хранится у пользователя в БД и еще действителен

      // Генерируем новый access token
      const newAccessToken = this.jwtService.sign(
        { id: payload.id, email: payload.email, role: payload.role },
        {
          expiresIn: '5m', // например, новый access token действителен 15 минут
        },
      );
      return {
        access_token: newAccessToken,
      };
    } catch (err) {
      throw new UnauthorizedException(
        'Неверный или просроченный refresh token',
      );
    }
  }

  async login(user: UserDto) {
    const payload = { id: user.id, email: user.email, role: user.role };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: '5m',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return { access_token, refresh_token };
  }

  async getProfile(email: string) {
    const user = await this.usersService.findOne(email);

    if (!user) {
      throw new UnauthorizedException('Неправильный email или пароль');
    }

    return user;
  }

  async register(
    email: string,
    password: string,
    inviteToken: string,
    username: string,
  ) {
    return this.usersService.create(email, password, inviteToken, username);
  }
}
