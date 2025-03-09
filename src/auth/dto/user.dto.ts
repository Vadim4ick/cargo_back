import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Емайл не валиден' })
  email: string;

  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
  password: string;

  @IsNotEmpty({ message: 'Токен' })
  @MinLength(6, { message: 'Неверный токен' })
  inviteToken: string;
}

export class UserDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ example: Role.USER })
  role: Role;

  @ApiProperty({ example: '2022-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: 'Vadim' })
  username?: string;
}

export class EditUserDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'Email пользователя',
  })
  @IsNotEmpty({ message: 'Email не должен быть пустым' })
  @IsEmail({}, { message: 'Неверный формат email' })
  email: string;

  @ApiProperty({ example: Role.USER, description: 'Роль пользователя' })
  @IsEnum(Role, { message: 'Недопустимое значение роли' })
  role: Role;

  @ApiProperty({ example: 'Vadim', description: 'Имя пользователя' })
  username?: string;
}
