// Додаємо поле user до Request, яке заповнює authGuard
declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: string };
    }
  }
}
export {};
