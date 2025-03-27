import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class CargoDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
    description: 'Уникальный идентификатор груза',
  })
  id: string;

  @ApiProperty({
    example: 'GR-20250308-001',
    description: 'Номер груза',
  })
  cargoNumber: string;

  @ApiProperty({
    example: '2025-03-08T00:00:00.000Z',
    description: 'Дата груза',
  })
  date: Date;

  @ApiProperty({
    example: 'Перевозка автотранспортом из Москвы в Санкт-Петербург',
    description: 'Информация о перевозке',
  })
  transportationInfo: string;

  @ApiProperty({
    example: 1500.75,
    description: 'Сумма выплаты',
  })
  payoutAmount: number;

  @ApiProperty({
    example: 'В течение 30 дней после доставки',
    description: 'Сроки выплаты',
  })
  payoutTerms: string;

  @ApiProperty({
    example: 'https://your-storage.com/uploads/cargo123.jpg',
    description: 'URL фотографии груза',
    required: false,
  })
  cargoPhotoUrl?: string; // Поле может быть `undefined`, если фото нет

  @ApiProperty({
    example: '2025-03-08T12:34:56.789Z',
    description: 'Дата создания записи',
  })
  createdAt: Date;
}

export class GetCargosDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit = 10;
}

export class CargoPaginatedDto {
  @ApiProperty({ type: [CargoDto], description: 'Список грузов' })
  data: CargoDto[];

  @ApiProperty({ example: 123, description: 'Общее количество записей' })
  total: number;

  @ApiProperty({ example: 13, description: 'Общее количество страниц' })
  pageCount: number;
}
