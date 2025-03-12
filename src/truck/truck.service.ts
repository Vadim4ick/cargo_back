import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TruckService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.truck.findMany();
  }
}
