import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CargoService } from './cargo.service';
import { CreateCargoDto } from './dto/create-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CargoDto } from './dto/CargoDto';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('cargo')
export class CargoController {
  constructor(private readonly cargoService: CargoService) {}

  @ApiOperation({ summary: 'Создание нового груза' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 201,
    description: 'Груз успешно создан',
    type: CargoDto,
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
  @ApiBody({
    type: CreateCargoDto,
    description: 'Данные для создания нового груза',
    examples: {
      cargo1: {
        summary: 'Пример груза',
        value: {
          cargoNumber: 'GR-20250308-001',
          date: '2025-03-08T00:00:00.000Z',
          transportationInfo:
            'Перевозка автотранспортом из Москвы в Санкт-Петербург',
          payoutAmount: 1500.75,
          payoutTerms: 'В течение 30 дней после доставки',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Roles('SUPERADMIN', 'EDITOR')
  @Post()
  create(@Body() createCargoDto: CreateCargoDto) {
    return this.cargoService.create(createCargoDto);
  }

  @ApiOperation({ summary: 'Получение списка грузов' })
  @ApiResponse({
    status: 200,
    description: 'Список грузов успешно получен',
    type: [CargoDto],
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
    return this.cargoService.findAll();
  }

  @ApiOperation({ summary: 'Обновление информации о грузе' })
  @ApiBody({
    type: UpdateCargoDto,
    description: 'Данные для обновления груза',
    examples: {
      cargoUpdate: {
        summary: 'Пример обновления груза',
        value: {
          cargoNumber: 'GR-20250308-002',
          date: '2025-03-09T00:00:00.000Z',
          transportationInfo: 'Перевозка железнодорожным транспортом',
          payoutAmount: 1800.5,
          payoutTerms: 'В течение 15 дней после доставки',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Информация о грузе успешно обновлена',
    type: CargoDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Груз не найден',
    schema: {
      example: {
        statusCode: 404,
        message: 'Груз не найден',
      },
    },
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
  @Roles('SUPERADMIN', 'EDITOR')
  @ApiBearerAuth('access-token')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCargoDto: UpdateCargoDto) {
    return this.cargoService.update(id, updateCargoDto);
  }

  @ApiOperation({ summary: 'Удаление груза по ID' })
  @ApiResponse({
    status: 200,
    description: 'Груз успешно удалён',
    schema: {
      example: {
        message: 'Груз успешно удалён',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Груз не найден',
    schema: {
      example: {
        statusCode: 404,
        message: 'Груз не найден',
      },
    },
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
  @Roles('SUPERADMIN', 'EDITOR')
  @ApiBearerAuth('access-token')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cargoService.remove(id);
  }
}
