import { prisma } from '../lib/prisma';
import { AppError } from '../utils/AppError';

export class OrderRepository {
  // Атомарне створення замовлення: або виконуються всі кроки, або жоден
  async createOrderTx(userId: number, items: Array<{ courseId: number; quantity: number }>) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new AppError(`Користувача з ID ${userId} не знайдено`, 404);

      let totalAmount = 0;
      const orderItemsData: Array<{ courseId: number; quantity: number; priceAtPurchase: number }> = [];

      for (const item of items) {
        const course = await tx.course.findUnique({ where: { id: item.courseId } });
        if (!course) throw new AppError(`Курс з ID ${item.courseId} не знайдено`, 404);

        const enrolled = await tx.enrollment.findUnique({
          where: { userId_courseId: { userId, courseId: item.courseId } },
        });
        if (enrolled) throw new AppError(`Користувач уже записаний на курс «${course.title}»`, 409);

        totalAmount += course.price * item.quantity;
        orderItemsData.push({
          courseId: item.courseId,
          quantity: item.quantity,
          priceAtPurchase: course.price, // фіксуємо ціну на момент покупки
        });
      }

      const order = await tx.order.create({
        data: { userId, totalAmount, items: { create: orderItemsData } },
        include: { items: true },
      });

      // запис на курси входить у ту саму транзакцію
      for (const item of orderItemsData) {
        await tx.enrollment.create({ data: { userId, courseId: item.courseId } });
      }
      return order;
    });
  }

  findById(id: number) {
    return prisma.order.findUnique({ where: { id }, include: { items: true } });
  }

  updateStatus(id: number, status: string) {
    return prisma.order.update({ where: { id }, data: { status }, include: { items: true } });
  }
}
