import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User, { SafeUser } from '../models/User';
import { ConflictError, UnauthorizedError, ForbiddenError } from '../errors/AppError';
import { ROLES } from '../config/constants';

const signToken = (id: unknown): string => {
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ id: String(id) }, process.env.JWT_SECRET!, {
    expiresIn,
  } as jwt.SignOptions);
};

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role?: ROLES;
  department?: string;
}

export const authService = {
  register: async (dto: RegisterDto): Promise<{ user: SafeUser; token: string }> => {
    const exists = await User.findOne({ email: dto.email });
    if (exists) throw new ConflictError('Email already registered');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await User.create({ ...dto, passwordHash });
    const token = signToken(user._id);
    return { user: user.toSafeObject(), token };
  },

  login: async (email: string, password: string): Promise<{ user: SafeUser; token: string }> => {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new UnauthorizedError('Invalid email or password');
    }
    if (!user.isActive) {
      throw new ForbiddenError('Account is inactive');
    }
    const token = signToken(user._id);
    return { user: user.toSafeObject(), token };
  },

  getMe: (user: { toSafeObject(): SafeUser }): SafeUser => user.toSafeObject(),
};
