import bcrypt from 'bcryptjs';
import User, { IUserDocument, SafeUser } from '../models/User';
import { paginate, PaginatedResult } from '../utils/paginate';
import { ConflictError, NotFoundError } from '../errors/AppError';
import { ROLES } from '../config/constants';

export interface UpdateUserDto {
  name?: string;
  role?: ROLES;
  department?: string;
  isActive?: boolean;
  password?: string;
}

export const userService = {
  getAll: async (query: Record<string, unknown>): Promise<PaginatedResult<IUserDocument>> => {
    return paginate(User, query, {}, 'name');
  },

  create: async (body: { name: string; email: string; password: string; role?: ROLES; department?: string }): Promise<SafeUser> => {
    const exists = await User.findOne({ email: body.email });
    if (exists) throw new ConflictError('Email already in use');
    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = await User.create({ ...body, passwordHash });
    return user.toSafeObject();
  },

  update: async (id: string, dto: UpdateUserDto): Promise<SafeUser> => {
    const user = await User.findById(id);
    if (!user) throw new NotFoundError('User not found');
    if (dto.name) user.name = dto.name;
    if (dto.role) user.role = dto.role;
    if (dto.department !== undefined) user.department = dto.department;
    if (dto.isActive !== undefined) user.isActive = dto.isActive;
    if (dto.password) user.passwordHash = await bcrypt.hash(dto.password, 10);
    await user.save();
    return user.toSafeObject();
  },

  remove: async (id: string): Promise<void> => {
    const user = await User.findById(id);
    if (!user) throw new NotFoundError('User not found');
    // Soft-delete: mark inactive and deleted rather than purging
    user.isActive = false;
    (user as any).isDeleted = true;
    (user as any).deletedAt = new Date();
    await user.save();
  },
};
