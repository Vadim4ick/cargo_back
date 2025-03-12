import { Controller, Get, UseGuards } from '@nestjs/common';
import { TruckService } from './truck.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TruckDto } from './dto/TruckDto';

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
}
