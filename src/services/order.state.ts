// Автомат станів замовлення: PENDING -> PAID -> CANCELLED
export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED';

const transitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['PAID', 'CANCELLED'],
  PAID: ['CANCELLED'],
  CANCELLED: [],
};

export const canTransition = (from: string, to: string): boolean =>
  (transitions[from as OrderStatus] ?? []).includes(to as OrderStatus);
