import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { TruckService } from './truck.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TruckDto } from './dto/TruckDto';
import { CargoPaginatedDto, GetCargosDto } from 'src/cargo/dto/CargoDto';

@Controller('truck')
export class TruckController {
  constructor(private readonly truckService: TruckService) {}

  @ApiOperation({ summary: 'Получение списка машин' })
  @ApiResponse({
    status: 200,
    description: 'Список машин успешно получен',
    type: [TruckDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get()
  findAll() {
    return this.truckService.findAll();
  }

  @ApiOperation({ summary: 'Получение списка грузов по машине' })
  @ApiResponse({
    status: 200,
    description: 'Список грузов успешно получен',
    type: CargoPaginatedDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 0,
    description: 'Номер страницы (начиная с 0)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Количество элементов на страницу',
  })
  @UseGuards(JwtAuthGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Получение списка грузов по машине с пагинацией' })
  @ApiResponse({ status: 200, description: 'Успешно' })
  @Get(':id/cargos')
  getCargosByTruck(@Param('id') id: string, @Query() query: GetCargosDto) {
    return this.truckService.getCargosByTruck(id, query);
  }
}
