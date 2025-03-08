import { ApiProperty } from '@nestjs/swagger';

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
    example: '2025-03-08T12:34:56.789Z',
    description: 'Дата создания записи',
  })
  createdAt: Date;
}
