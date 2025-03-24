import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCargoDto } from './dto/create-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto';
import { PrismaService } from 'src/prisma.service';
import * as path from 'path';

@Injectable()
export class CargoService {
  constructor(private prisma: PrismaService) {}

  async create(
    createCargoDto: CreateCargoDto,
    cargoPhoto?: Express.Multer.File,
  ) {
    let photoUrl: string | null = null;

    if (cargoPhoto) {
      photoUrl = path.join('images', cargoPhoto.filename); // Формируем путь
    }

    return this.prisma.cargo.create({
      data: {
        ...createCargoDto,
        cargoPhoto: photoUrl ? { create: { url: photoUrl } } : undefined, // Создаем запись фото
      },
      include: { truck: true, cargoPhoto: true },
    });
  }

  findAll() {
    return this.prisma.cargo.findMany({
      include: { cargoPhoto: true },
    });
  }

  async update(
    id: string,
    updateCargoDto: UpdateCargoDto,
    cargoPhoto?: Express.Multer.File,
  ) {
    const cargo = await this.prisma.cargo.findUnique({
      where: { id },
      include: { cargoPhoto: true },
    });

    if (!cargo) {
      throw new NotFoundException('Груз не найден');
    }

    let photoUrl: string | null = cargo.cargoPhoto?.url || null;

    if (cargoPhoto) {
      photoUrl = path.join('images', cargoPhoto.filename); // Формируем новый путь

      // Если фото уже было, обновляем, иначе создаем
      if (cargo.cargoPhoto) {
        await this.prisma.cargoPhoto.update({
          where: { cargoId: cargo.id },
          data: { url: photoUrl },
        });
      } else {
        await this.prisma.cargoPhoto.create({
          data: { cargoId: cargo.id, url: photoUrl },
        });
      }
    }

    return this.prisma.cargo.update({
      where: { id },
      data: {
        ...updateCargoDto,
        cargoPhoto: photoUrl ? { update: { url: photoUrl } } : undefined, // Обновляем фото
      },
      include: { cargoPhoto: true },
    });
  }

  async findById({ id }: { id: string }) {
    const cargo = await this.prisma.cargo.findUnique({
      where: { id },
      include: { cargoPhoto: true },
    });

    if (!cargo) {
      throw new NotFoundException('Груз не найден');
    }

    return cargo;
  }

  async remove(id: string) {
    const cargo = await this.prisma.cargo.findUnique({ where: { id } });

    if (!cargo) {
      throw new NotFoundException(`Груз с id не найден`);
    }

    return this.prisma.cargo.delete({
      where: { id },
    });
  }
}
