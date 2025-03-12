import { ApiProperty } from '@nestjs/swagger';
import { Cargo } from '@prisma/client';

export class TruckDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
    description: 'Уникальный идентификатор груза',
  })
  id: string;

  @ApiProperty({
    example: 'GR-20250308-001',
    description: 'Номер груза',
  })
  name: string;

  @ApiProperty({
    example: [],
    description: 'Грузы',
  })
  cargos: Cargo[];
}
