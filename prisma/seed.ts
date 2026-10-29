import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // чистимо таблиці, щоб seed можна було запускати повторно
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const teacher = await prisma.user.create({
    data: { email: 'teacher@example.com', password: 'hash_teacher', fullName: 'Олена Коваль', role: 'MANAGER' },
  });
  const admin = await prisma.user.create({
    data: { email: 'admin@example.com', password: 'hash_admin', fullName: 'Адмін Платформи', role: 'ADMIN' },
  });
  const student1 = await prisma.user.create({
    data: { email: 'ivan@example.com', password: 'hash_ivan', fullName: 'Іван Петренко' },
  });
  const student2 = await prisma.user.create({
    data: { email: 'maria@example.com', password: 'hash_maria', fullName: 'Марія Шевченко' },
  });

  const course1 = await prisma.course.create({
    data: {
      title: 'Основи TypeScript',
      description: 'Типи, функції, класи та модулі',
      price: 1200,
      instructorId: teacher.id,
    },
  });
  const course2 = await prisma.course.create({
    data: {
      title: 'Node.js та Express',
      description: 'Створення REST API',
      price: 1800,
      instructorId: teacher.id,
    },
  });

  const module1 = await prisma.module.create({
    data: { title: 'Початок роботи', position: 1, courseId: course1.id },
  });
  const module2 = await prisma.module.create({
    data: { title: 'Типи даних', position: 2, courseId: course1.id },
  });
  const module3 = await prisma.module.create({
    data: { title: 'Перший сервер', position: 1, courseId: course2.id },
  });

  await prisma.lesson.createMany({
    data: [
      { title: 'Встановлення TypeScript', content: 'npm install -D typescript', durationMinutes: 10, moduleId: module1.id },
      { title: 'Налаштування tsconfig', content: 'Основні опції компілятора', durationMinutes: 15, moduleId: module1.id },
      { title: 'Примітивні типи', content: 'string, number, boolean', durationMinutes: 20, moduleId: module2.id },
      { title: 'Express: Hello World', content: 'Простий маршрут GET /', durationMinutes: 25, moduleId: module3.id },
    ],
  });

  await prisma.enrollment.createMany({
    data: [
      { userId: student1.id, courseId: course1.id, progressPercent: 40 },
      { userId: student1.id, courseId: course2.id, progressPercent: 10 },
      { userId: student2.id, courseId: course1.id, progressPercent: 75 },
    ],
  });

  console.log(`Створено користувачів: 4 (адмін: ${admin.email})`);
  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
