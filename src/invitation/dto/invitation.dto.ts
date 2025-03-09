import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InvitationDto {
  @IsNotEmpty({ message: 'Email не должен быть пустым' })
  @IsEmail({}, { message: 'Неверный формат email' })
  @ApiProperty({ example: 'john@example.com' })
  email: string;
}
