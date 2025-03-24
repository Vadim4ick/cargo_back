import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CargoService } from './cargo.service';
import { CreateCargoDto } from './dto/create-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CargoDto } from './dto/CargoDto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'src/config/multer-config';

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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Данные для создания нового груза',
    schema: {
      type: 'object',
      properties: {
        cargoNumber: { type: 'string', example: 'GR-20250308-001' },
        date: { type: 'string', example: '2025-03-08T00:00:00.000Z' },
        transportationInfo: {
          type: 'string',
          example: 'Перевозка автотранспортом из Москвы в Санкт-Петербург',
        },
        payoutAmount: { type: 'number', example: 1500.75 },
        payoutTerms: {
          type: 'string',
          example: 'В течение 30 дней после доставки',
        },
        truckId: { type: 'string', example: 'truck-uuid-12345' },
        cargoPhoto: {
          type: 'string',
          format: 'binary',
          example: 'Файл изображения',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Roles('SUPERADMIN', 'EDITOR')
  @Post()
  @UseInterceptors(FileInterceptor('cargoPhoto', storageConfig))
  create(
    @Body() createCargoDto: CreateCargoDto,
    @UploadedFile() cargoPhoto?: Express.Multer.File,
  ) {
    return this.cargoService.create(createCargoDto, cargoPhoto);
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

  @ApiOperation({ summary: 'Получение информации о грузе по ID' })
  @ApiResponse({
    status: 200,
    description: 'Груз успешно найден',
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
  @ApiBearerAuth('access-token')
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.cargoService.findById({ id });
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Обновление информации о грузе (multipart/form-data)',
  })
  @ApiConsumes('multipart/form-data') // Позволяет принимать файлы
  @ApiBody({
    description: 'Данные для обновления груза',
    schema: {
      type: 'object',
      properties: {
        cargoNumber: { type: 'string', example: 'GR-20250308-002' },
        date: { type: 'string', example: '2025-03-09T00:00:00.000Z' },
        transportationInfo: {
          type: 'string',
          example: 'Перевозка железнодорожным транспортом',
        },
        payoutAmount: { type: 'number', example: 1800.5 },
        payoutTerms: {
          type: 'string',
          example: 'В течение 15 дней после доставки',
        },
        cargoPhoto: {
          type: 'string',
          format: 'binary',
          example: 'Файл изображения',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Информация о грузе успешно обновлена',
    type: CargoDto,
  })
  @UseGuards(JwtAuthGuard)
  @Roles('SUPERADMIN', 'EDITOR')
  @ApiBearerAuth('access-token')
  @UseInterceptors(FileInterceptor('cargoPhoto', storageConfig)) // Обработка загружаемого файла
  update(
    @Param('id') id: string,
    @Body() updateCargoDto: UpdateCargoDto,
    @UploadedFile() cargoPhoto?: Express.Multer.File,
  ) {
    return this.cargoService.update(id, updateCargoDto, cargoPhoto);
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
