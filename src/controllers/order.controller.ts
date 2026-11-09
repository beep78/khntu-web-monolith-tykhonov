import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { asyncHandler } from '../utils/asyncHandler';

const orderService = new OrderService();

export class OrderController {
  static create = asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.create(req.body);
    res.status(201).json({ status: 'success', data: order });
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.getById(Number(req.params.id));
    res.status(200).json({ status: 'success', data: order });
  });

  static changeStatus = asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.changeStatus(Number(req.params.id), req.body.status);
    res.status(200).json({ status: 'success', data: order });
  });
}
