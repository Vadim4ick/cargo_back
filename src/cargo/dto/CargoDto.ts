import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsUUID,
  IsInt,
  Min,
} from 'class-validator';

export class CargoDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
    description: 'Уникальный идентификатор груза',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    example: '2025-03-08T12:34:56.789Z',
    description: 'Дата создания записи',
  })
  @IsDateString()
  createdAt: string;

  @ApiProperty({
    example: '2025-03-08T00:00:00.000Z',
    description: 'Дата заявки',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    example: 'GR-20250308-001',
    description: 'Номер груза или заявки',
  })
  @IsString()
  cargoNumber: string;

  @ApiProperty({
    example: '2025-03-09T09:00:00.000Z',
    description: 'Дата загрузки/выгрузки',
  })
  @IsDateString()
  loadUnloadDate: string;

  @ApiProperty({
    example: 'Иванов Иван Иванович',
    description: 'ФИО или идентификатор водителя',
  })
  @IsString()
  driver: string;

  @ApiProperty({
    example: 'Перевозка автотранспортом из Москвы в Санкт-Петербург',
    description: 'Подробная информация о грузе',
  })
  @IsString()
  transportationInfo: string;

  @ApiProperty({
    example: 1500.75,
    description: 'Сумма выплат',
  })
  @IsNumber()
  payoutAmount: number;

  @ApiProperty({
    example: '2025-03-20T00:00:00.000Z',
    description: 'Дата оплаты',
  })
  @IsDateString()
  payoutDate: string;

  @ApiProperty({
    example: 'Ожидается',
    description:
      'Статус оплаты (например, "Оплачено", "Ожидается", "Просрочено")',
  })
  @IsString()
  paymentStatus: string;

  // @ApiProperty({
  //   description: 'Ссылки на документы (файлы/картинки)',
  //   type: [String],
  //   example: [
  //     'https://example.com/documents/act.pdf',
  //     'https://example.com/documents/photo.jpg',
  //   ],
  //   required: false,
  // })
  // @IsOptional()
  // cargoPhotos?: string[];
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
