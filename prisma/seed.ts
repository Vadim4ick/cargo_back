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
      "CargoPhoto",
      "Invitation"
    RESTART IDENTITY CASCADE;
  `);

  console.log('✅ Все таблицы очищены');

  console.log('🚛 Начинаем сидинг данных...');

  // Добавляем 6 машин
  await prisma.truck.createMany({
    data: [
      { name: 'Sitrak 183' },
      { name: 'Sitrak 911' },
      { name: 'Sitrak 254' },
      { name: 'HOWO 174' },
      { name: 'HOWO 661' },
      { name: 'Газон' },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Добавлены машины');

  // Получаем машины из БД для связи с грузами
  const truckList = await prisma.truck.findMany();

  // Для каждой машины создаём по 3 груза
  for (const truck of truckList) {
    await prisma.cargo.createMany({
      data: [
        {
          date: new Date('2025-03-14'),
          cargoNumber: `CARGO-${truck.name}-1`,
          loadUnloadDate: new Date('2025-03-16'),
          driver: 'Иванов Иван',
          transportationInfo: 'Описание груза',
          payoutAmount: 1500,
          payoutDate: new Date('2025-03-20'),
          paymentStatus: 'Оплачено',
          payoutTerms: 'Предоплата',
          truckId: truck.id,
        },
        {
          date: new Date('2025-02-10'),
          cargoNumber: `CARGO-${truck.name}-3`,
          loadUnloadDate: new Date('2025-03-10'),
          driver: 'Иванов Иван',
          transportationInfo: 'Описание груза',
          payoutAmount: 2500,
          payoutDate: new Date('2025-03-25'),
          paymentStatus: 'Оплачено',
          payoutTerms: 'Предоплата',
          truckId: truck.id,
        },
        {
          date: new Date('2025-01-01'),
          cargoNumber: `CARGO-${truck.name}-2`,
          loadUnloadDate: new Date('2025-02-05'),
          driver: 'Иванов Иван',
          transportationInfo: 'Описание груза',
          payoutAmount: 3500,
          payoutDate: new Date('2025-02-15'),
          paymentStatus: 'Оплачено',
          payoutTerms: 'Предоплата',
          truckId: truck.id,
        },
      ],
    });
  }

  console.log('✅ Добавлено по 3 груза к каждой машине');

  // [Необязательно] Пример добавления фотографий (CargoPhoto) к первому грузу каждой машины
  // Если нужно продемонстрировать добавление фото, можно сделать так:
  // for (const truck of truckList) {
  //   // Находим первый груз у конкретной машины
  //   const [firstCargo] = await prisma.cargo.findMany({
  //     where: { truckId: truck.id },
  //     take: 1,
  //   });
  //   if (firstCargo) {
  //     await prisma.cargoPhoto.createMany({
  //       data: [
  //         {
  //           url: `http://example.com/images/${firstCargo.cargoNumber}-1.jpg`,
  //           cargoId: firstCargo.id,
  //         },
  //         {
  //           url: `http://example.com/images/${firstCargo.cargoNumber}-2.jpg`,
  //           cargoId: firstCargo.id,
  //         },
  //       ],
  //     });
  //   }
  // }

  console.log('✅ Добавлены фото (пример кода закомментирован)');

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
