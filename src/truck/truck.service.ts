import { Injectable } from '@nestjs/common';
import { GetCargosDto } from 'src/cargo/dto/CargoDto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TruckService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.truck.findMany();
  }

  async getCargosByTruck(truckId: string, query: GetCargosDto) {
    const { page = 0, limit = 10 } = query;

    const [{ _count }, cargos] = await this.prisma.$transaction([
      this.prisma.cargo.aggregate({
        _count: true,
        where: { truckId },
      }),
      this.prisma.cargo.findMany({
        where: { truckId },
        skip: Number(page) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: cargos,
      total: _count,
      pageCount: Math.ceil(_count / limit),
    };
  }
}
