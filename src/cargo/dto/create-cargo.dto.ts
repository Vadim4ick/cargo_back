import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCargoDto {
  @IsNotEmpty({ message: 'Номер груза не может быть пустым' })
  @IsString({ message: 'Номер груза должен быть строкой' })
  @ApiProperty({ example: 'CN-12345' })
  cargoNumber: string;

  @IsNotEmpty({ message: 'Дата не может быть пустой' })
  @IsDateString({}, { message: 'Неверный формат даты' })
  @ApiProperty({ example: '2024-03-12T00:00:00.000Z' })
  date: string;

  @IsNotEmpty({ message: 'Информация о перевозке не может быть пустой' })
  @IsString({ message: 'Информация о перевозке должна быть строкой' })
  @ApiProperty({ example: 'Маршрут A-B' })
  transportationInfo: string;

  @IsNotEmpty({ message: 'Сумма выплаты не может быть пустой' })
  // @IsNumber({}, { message: 'Сумма выплаты должна быть числом' })
  @ApiProperty({ example: 1500 })
  payoutAmount: number;

  @IsNotEmpty({ message: 'Сроки выплаты не могут быть пустыми' })
  @IsString({ message: 'Сроки выплаты должны быть строкой' })
  @ApiProperty({ example: 'Предоплата' })
  payoutTerms: string;

  @IsNotEmpty({ message: 'ID машины не может быть пустым' })
  @IsString({ message: 'ID машины не может быть пустым' })
  @ApiProperty({ example: 'truck-uuid-12345' })
  truckId: string;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  cargoPhoto?: Express.Multer.File;
}
