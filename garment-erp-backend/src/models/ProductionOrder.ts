import { softDeletePlugin } from '../utils/softDeletePlugin';
import { Schema, model, Document, Types } from 'mongoose';
import { PRODUCTION_STAGES, ProductionStage } from '../config/constants';

interface IDailyProd {
  date?: Date;
  qty?: number;
  shift?: string;
}

export type ProductionStatus = 'planned' | 'inProgress' | 'completed' | 'onHold';

export interface IProductionOrderDocument extends Document {
  prodOrderNo?: string;
  orderId?: Types.ObjectId;
  styleId?: Types.ObjectId;
  stage: ProductionStage;
  processUnit?: string;
  plannedQuantity: number;
  actualQuantity: number;
  operator?: string;
  supervisor?: string;
  machineName?: string;
  startDate?: Date;
  endDate?: Date;
  status: ProductionStatus;
  dailyProduction: IDailyProd[];
  createdAt: Date;
  updatedAt: Date;
  progress: number;
}

const dailyProdSchema = new Schema<IDailyProd>(
  { date: Date, qty: Number, shift: String },
  { _id: false }
);

const productionOrderSchema = new Schema<IProductionOrderDocument>(
  {
    prodOrderNo: { type: String, unique: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    styleId: { type: Schema.Types.ObjectId, ref: 'Style' },
    stage: { type: String, enum: PRODUCTION_STAGES, required: true },
    processUnit: String,
    plannedQuantity: { type: Number, default: 0 },
    actualQuantity: { type: Number, default: 0 },
    operator: String,
    supervisor: String,
    machineName: String,
    startDate: Date,
    endDate: Date,
    status: { type: String, enum: ['planned', 'inProgress', 'completed', 'onHold'], default: 'planned' },
    dailyProduction: [dailyProdSchema],
  },
  { timestamps: true }
);

productionOrderSchema.virtual('progress').get(function (this: IProductionOrderDocument) {
  if (!this.plannedQuantity) return 0;
  return Math.min(100, Math.round((this.actualQuantity / this.plannedQuantity) * 100));
});

productionOrderSchema.set('toJSON', { virtuals: true });

productionOrderSchema.plugin(softDeletePlugin);

export default model<IProductionOrderDocument>('ProductionOrder', productionOrderSchema);
