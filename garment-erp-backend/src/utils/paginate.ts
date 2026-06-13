import { Model, FilterQuery } from 'mongoose';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMeta;
}

export const paginate = async <T>(
  model: Model<T>,
  query: Record<string, unknown>,
  filter: FilterQuery<T> = {},
  sort: string = '-createdAt'
): Promise<PaginatedResult<T>> => {
  const page = Math.max(parseInt(String(query.page ?? 1)) || 1, 1);
  const limit = Math.min(parseInt(String(query.limit ?? 20)) || 20, 100);
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model.find(filter).sort(sort).skip(skip).limit(limit),
    model.countDocuments(filter),
  ]);

  return {
    data: data as T[],
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};
