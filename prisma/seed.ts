import { PrismaClient } from '@prisma/client';

import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🔥 Очищаем все таблицы...');

  // Очистка всех таблиц перед вставкой новых данных
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "User",
      "Truck",
      "Cargo",
      "Invitation"
    RESTART IDENTITY CASCADE;
  `);

  console.log('✅ Все таблицы очищены');

  console.log('🚛 Начинаем сидинг данных...');

  // Добавляем 4 машины
  await prisma.truck.createMany({
    data: [
      { name: 'Scania R500' },
      { name: 'Volvo FH16' },
      { name: 'Mercedes Actros' },
      { name: 'DAF XF105' },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Добавлены машины');

  // Получаем машины из БД для связи с грузами
  const truckList = await prisma.truck.findMany();

  // Добавляем грузы и связываем их с машинами
  await prisma.cargo.createMany({
    data: [
      {
        cargoNumber: 'CARGO-1001',
        date: new Date(),
        transportationInfo: 'Перевозка электроники',
        payoutAmount: 5000.75,
        payoutTerms: '50% предоплата',
        truckId: truckList[0].id,
      },
      {
        cargoNumber: 'CARGO-1002',
        date: new Date(),
        transportationInfo: 'Перевозка мебели',
        payoutAmount: 3200.5,
        payoutTerms: 'Оплата после доставки',
        truckId: truckList[1].id,
      },
      {
        cargoNumber: 'CARGO-1003',
        date: new Date(),
        transportationInfo: 'Продукты питания',
        payoutAmount: 2000.0,
        payoutTerms: '100% предоплата',
        truckId: truckList[2].id,
      },
      {
        cargoNumber: 'CARGO-1004',
        date: new Date(),
        transportationInfo: 'Строительные материалы',
        payoutAmount: 7500.25,
        payoutTerms: 'Оплата через 14 дней',
        truckId: truckList[3].id,
      },
    ],
  });

  console.log('✅ Добавлены грузы');

  // Добавляем пользователя Суперадмина
  const hashedPassword = await bcrypt.hash('123456', 10);

  await prisma.user.create({
    data: {
      email: 'firulvv@mail.ru',
      password: hashedPassword, // Хешируем пароль
      username: 'Firulvv',
      role: 'SUPERADMIN',
    },
  });

  console.log('✅ Добавлен Суперадмин');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при сидинге:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
