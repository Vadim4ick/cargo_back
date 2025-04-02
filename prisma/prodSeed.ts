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

  // Добавляем пользователя Суперадмина
  const hashedPassword = await bcrypt.hash('123456', 10);
  const hashedPassword2 = await bcrypt.hash('Federal33965', 10);

  await prisma.user.create({
    data: {
      email: 'firulvv@mail.ru',
      password: hashedPassword, // Хешируем пароль
      username: 'Firulvv',
      role: 'SUPERADMIN',
    },
  });

  await prisma.user.create({
    data: {
      email: 'zheludkov.d01@mail.ru',
      password: hashedPassword2, // Хешируем пароль
      username: 'Danil',
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
