import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { EditUserDto, UserDto } from 'src/auth/dto/user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список пользователей' })
  @ApiResponse({
    status: 200,
    description: 'Список пользователей',
    type: [UserDto],
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
  async getAll() {
    return this.usersService.getAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Редактировать пользователя по ID' })
  @ApiParam({ name: 'id', description: 'ID пользователя', example: '123456' })
  @ApiBody({ type: EditUserDto })
  @ApiResponse({
    status: 200,
    description: 'Пользователь успешно обновлен',
    schema: {
      example: {
        message: 'Пользователь успешно обновлен',
        data: {
          user: UserDto,
        },
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
  async editById(@Param('id') id: string, @Body() editUserDto: EditUserDto) {
    return this.usersService.editById(id, editUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить пользователя по ID' })
  @ApiParam({ name: 'id', description: 'ID пользователя', example: '123456' })
  @ApiResponse({
    status: 200,
    description: 'Пользователь успешно удалён',
    schema: {
      example: {
        message: 'Пользователь успешно удалён',
        data: {
          user: UserDto,
        },
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
  async removeById(@Param('id') id: string) {
    return this.usersService.removeById(id);
  }
}
