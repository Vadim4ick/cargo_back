import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCargoDto {
  @IsOptional()
  @IsUUID('4', { message: 'ID должен быть формата UUID v4' })
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
    description:
      'Уникальный идентификатор груза (опционально, обычно генерируется автоматически)',
    required: false,
  })
  id?: string;

  @IsOptional()
  @IsDateString({}, { message: 'createdAt должен быть в формате даты' })
  @ApiProperty({
    example: '2025-03-08T12:34:56.789Z',
    description:
      'Дата создания записи (опционально, обычно проставляется автоматически)',
    required: false,
  })
  createdAt?: string;

  @IsNotEmpty({ message: 'Дата заявки не может быть пустой' })
  @IsDateString({}, { message: 'Неверный формат даты заявки' })
  @ApiProperty({
    example: '2024-03-12T00:00:00.000Z',
    description: 'Дата заявки (date)',
  })
  date: string;

  @IsNotEmpty({ message: 'Номер груза не может быть пустым' })
  @IsString({ message: 'Номер груза должен быть строкой' })
  @ApiProperty({
    example: 'CN-12345',
    description: 'Номер груза (cargoNumber)',
  })
  cargoNumber: string;

  @IsNotEmpty({ message: 'Дата загрузки/выгрузки не может быть пустой' })
  @IsDateString({}, { message: 'Неверный формат даты загрузки/выгрузки' })
  @ApiProperty({
    example: '2024-03-15T08:00:00.000Z',
    description: 'Дата загрузки/выгрузки (loadUnloadDate)',
  })
  loadUnloadDate: string;

  @IsNotEmpty({ message: 'Поле "водитель" не может быть пустым' })
  @IsString({ message: 'Водитель должен быть строкой' })
  @ApiProperty({
    example: 'Иванов Иван Иванович',
    description: 'Водитель (driver)',
  })
  driver: string;

  @IsNotEmpty({ message: 'Подробная информация о грузе не может быть пустой' })
  @IsString({ message: 'Информация о грузе должна быть строкой' })
  @ApiProperty({
    example: 'Маршрут перевозки A → B, габариты груза, особенности погрузки',
    description: 'Подробная информация о грузе (transportationInfo)',
  })
  transportationInfo: string;

  @IsNotEmpty({ message: 'Сумма выплаты не может быть пустой' })
  // Если нужно строгая проверка на число, раскомментируйте
  // @IsNumber({}, { message: 'Сумма выплаты должна быть числом' })
  @ApiProperty({
    example: 1500,
    description: 'Сумма выплат (payoutAmount)',
  })
  payoutAmount: number;

  @IsNotEmpty({ message: 'Дата оплаты не может быть пустой' })
  @IsDateString({}, { message: 'Неверный формат даты оплаты' })
  @ApiProperty({
    example: '2024-03-20T00:00:00.000Z',
    description: 'Дата оплаты (payoutDate)',
  })
  payoutDate: string;

  @IsNotEmpty({ message: 'Статус оплаты не может быть пустым' })
  @IsString({ message: 'Статус оплаты должен быть строкой' })
  @ApiProperty({
    example: 'Оплачено',
    description: 'Статус оплаты (paymentStatus)',
  })
  paymentStatus: string;

  @IsNotEmpty({ message: 'Сроки выплаты не могут быть пустыми' })
  @IsString({ message: 'Сроки выплаты должны быть строкой' })
  @ApiProperty({
    example: 'Предоплата',
    description: 'Сроки выплаты (payoutTerms)',
  })
  payoutTerms: string;

  @IsNotEmpty({ message: 'ID машины не может быть пустым' })
  @IsString({ message: 'ID машины должно быть строкой' })
  @ApiProperty({
    example: 'truck-uuid-12345',
    description:
      'ID машины (truckId), необходимо для привязки груза к конкретной машине',
  })
  truckId: string;

  // @IsOptional()
  // @ApiProperty({
  //   type: 'array',
  //   items: {
  //     type: 'string',
  //     format: 'binary',
  //   },
  //   required: false,
  //   description: 'Документы (файлы/картинки). Можно загружать несколько',
  // })
  // documents?: Express.Multer.File[];
}
