import { Types } from 'mongoose';
import QualityInspection, { IQualityInspectionDocument } from '../models/QualityInspection';
import { paginate, PaginatedResult } from '../utils/paginate';

export const qualityService = {
  getAll: async (query: Record<string, unknown>, filter: Record<string, unknown>): Promise<PaginatedResult<IQualityInspectionDocument>> => {
    return paginate(QualityInspection, query, filter);
  },

  create: async (body: Record<string, unknown>, inspectorId: Types.ObjectId): Promise<IQualityInspectionDocument> => {
    const defectsFound = (body.defectsFound as Array<{ count?: number }>) || [];
    const totalDefects = defectsFound.reduce((sum, d) => sum + (d.count || 0), 0);
    return QualityInspection.create({ ...body, totalDefects, inspector: inspectorId });
  },
};
