import { AppError } from '../utils/AppError';
import { OrderRepository } from '../repositories/order.repository';
import { canTransition } from './order.state';
import { CreateOrderDto } from '../dto/order.dto';

const orderRepository = new OrderRepository();

export class OrderService {
  create(dto: CreateOrderDto) {
    return orderRepository.createOrderTx(dto.userId, dto.items);
  }

  async getById(id: number) {
    const order = await orderRepository.findById(id);
    if (!order) throw new AppError('Замовлення не знайдено', 404);
    return order;
  }

  async changeStatus(id: number, status: string) {
    const order = await this.getById(id);
    if (!canTransition(order.status, status)) {
      throw new AppError(`Перехід зі статусу ${order.status} у ${status} неможливий`, 409);
    }
    return orderRepository.updateStatus(id, status);
  }
}
