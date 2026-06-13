import { Schema, model, Document, Model } from 'mongoose';
import { softDeletePlugin } from '../utils/softDeletePlugin';
import bcrypt from 'bcryptjs';
import { ROLES } from '../config/constants';

export interface SafeUser {
  id: unknown;
  name: string;
  email: string;
  role: string;
  department: string;
  isActive: boolean;
  createdAt: Date;
}

export interface IUserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: ROLES;
  department: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(plain: string): Promise<boolean>;
  toSafeObject(): SafeUser;
}

interface IUserModel extends Model<IUserDocument> {}

const userSchema = new Schema<IUserDocument, IUserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.VIEWER },
    department: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function (plain: string): Promise<boolean> {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.methods.toSafeObject = function (): SafeUser {
  const { _id, name, email, role, department, isActive, createdAt } = this;
  return { id: _id, name, email, role, department, isActive, createdAt };
};

userSchema.plugin(softDeletePlugin);

export default model<IUserDocument, IUserModel>('User', userSchema);
