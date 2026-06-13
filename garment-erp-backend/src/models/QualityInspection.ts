import { softDeletePlugin } from '../utils/softDeletePlugin';
import { Schema, model, Document, Types } from 'mongoose';

interface IDefect {
  defectType?: string;
  count?: number;
}

export type InspectionType = 'fabricInspection' | 'sewingInline' | 'finalInspection' | 'auditInspection';
export type InspectionResult = 'pass' | 'fail' | 'conditional';

export interface IQualityInspectionDocument extends Document {
  inspectionType: InspectionType;
  orderId?: Types.ObjectId;
  productionOrderId?: Types.ObjectId;
  inspectionDate: Date;
  inspector?: Types.ObjectId;
  sampleSize?: number;
  defectsFound: IDefect[];
  totalDefects: number;
  result: InspectionResult;
  remarks?: string;
  photos: string[];
  createdAt: Date;
  updatedAt: Date;
}

const defectSchema = new Schema<IDefect>(
  { defectType: String, count: Number },
  { _id: false }
);

const qiSchema = new Schema<IQualityInspectionDocument>(
  {
    inspectionType: {
      type: String,
      enum: ['fabricInspection', 'sewingInline', 'finalInspection', 'auditInspection'],
      required: true,
    },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    productionOrderId: { type: Schema.Types.ObjectId, ref: 'ProductionOrder' },
    inspectionDate: { type: Date, default: Date.now },
    inspector: { type: Schema.Types.ObjectId, ref: 'User' },
    sampleSize: Number,
    defectsFound: [defectSchema],
    totalDefects: { type: Number, default: 0 },
    result: { type: String, enum: ['pass', 'fail', 'conditional'], default: 'pass' },
    remarks: String,
    photos: [String],
  },
  { timestamps: true }
);

qiSchema.plugin(softDeletePlugin);

export default model<IQualityInspectionDocument>('QualityInspection', qiSchema);
