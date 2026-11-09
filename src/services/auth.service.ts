import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { AppError } from '../utils/AppError';
import { RegisterDto, LoginDto } from '../dto/auth.dto';

const userRepository = new UserRepository();
const SALT_ROUNDS = 10;

export class AuthService {
  async register(dto: RegisterDto) {
    const existing = await userRepository.findByEmail(dto.email);
    if (existing) throw new AppError('Користувач з таким email вже існує', 400);

    // асинхронне незворотне хешування з сіллю; роль завжди USER
    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await userRepository.create({ email: dto.email, password: passwordHash, fullName: dto.fullName });
    return { id: user.id, email: user.email, fullName: user.fullName, role: user.role };
  }

  async login(dto: LoginDto) {
    const user = await userRepository.findByEmail(dto.email);
    if (!user) throw new AppError('Невірний email або пароль', 401);

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new AppError('Невірний email або пароль', 401);

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new AppError('JWT_SECRET не налаштовано', 500);

    // Access JWT на 15 хвилин
    const token = jwt.sign({ sub: String(user.id), role: user.role }, secret, { expiresIn: '15m' });
    return { token, user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role } };
  }
}
