import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCargoDto } from './dto/create-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CargoService {
  constructor(private prisma: PrismaService) {}

  create(createCargoDto: CreateCargoDto) {
    return this.prisma.cargo.create({
      data: {
        ...createCargoDto,
      },
      include: { truck: true },
    });
  }

  findAll() {
    return this.prisma.cargo.findMany();
  }

  async update(id: string, updateCargoDto: UpdateCargoDto) {
    const cargo = await this.prisma.cargo.findUnique({ where: { id } });

    if (!cargo) {
      throw new NotFoundException(`Груз с id не найден`);
    }

    return this.prisma.cargo.update({
      where: { id },
      data: updateCargoDto,
    });
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
