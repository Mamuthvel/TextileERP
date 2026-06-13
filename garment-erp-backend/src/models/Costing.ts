import { softDeletePlugin } from '../utils/softDeletePlugin';
import { Schema, model, Document, Types } from 'mongoose';

export type CostingType = 'estimate' | 'post';

export interface ICostingDocument extends Document {
  orderId: Types.ObjectId;
  type: CostingType;
  yarnCost: number;
  fabricCost: number;
  trimmingCost: number;
  dyeingCost: number;
  sewingCost: number;
  overheadCost: number;
  packingCost: number;
  totalCost: number;
  sellingPrice: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  profitMargin: number;
}

const costingSchema = new Schema<ICostingDocument>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    type: { type: String, enum: ['estimate', 'post'], required: true },
    yarnCost: { type: Number, default: 0 },
    fabricCost: { type: Number, default: 0 },
    trimmingCost: { type: Number, default: 0 },
    dyeingCost: { type: Number, default: 0 },
    sewingCost: { type: Number, default: 0 },
    overheadCost: { type: Number, default: 0 },
    packingCost: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
    sellingPrice: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
  },
  { timestamps: true }
);

costingSchema.virtual('profitMargin').get(function (this: ICostingDocument) {
  if (!this.sellingPrice) return 0;
  return Number((((this.sellingPrice - this.totalCost) / this.sellingPrice) * 100).toFixed(2));
});

costingSchema.set('toJSON', { virtuals: true });

costingSchema.plugin(softDeletePlugin);

export default model<ICostingDocument>('Costing', costingSchema);
