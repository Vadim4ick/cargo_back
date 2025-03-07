import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Емайл не валиден' })
  email: string;

  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
  password: string;
}

export class UserDto {
  id: string;
  email: string;
  createdAt: Date;
  username?: string;
}
