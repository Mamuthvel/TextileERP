import { softDeletePlugin } from '../utils/softDeletePlugin';
import { Schema, model, Document, Types } from 'mongoose';

interface IYarn {
  description?: string;
  count?: string;
  composition?: string;
  quantityKg?: number;
  unitCost?: number;
}

interface IFabric {
  description?: string;
  construction?: string;
  quantityMtrs?: number;
  unitCost?: number;
}

interface ILineItem {
  description?: string;
  uom?: string;
  quantity?: number;
  unitCost?: number;
}

export interface IBOMDocument extends Document {
  styleId?: Types.ObjectId;
  orderId?: Types.ObjectId;
  yarns: IYarn[];
  fabrics: IFabric[];
  trims: ILineItem[];
  totalEstimatedCost: number;
  createdAt: Date;
  updatedAt: Date;
}

const lineItem = new Schema<ILineItem>(
  { description: String, uom: String, quantity: Number, unitCost: Number },
  { _id: false }
);

const bomSchema = new Schema<IBOMDocument>(
  {
    styleId: { type: Schema.Types.ObjectId, ref: 'Style' },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    yarns: [
      new Schema<IYarn>(
        { description: String, count: String, composition: String, quantityKg: Number, unitCost: Number },
        { _id: false }
      ),
    ],
    fabrics: [
      new Schema<IFabric>(
        { description: String, construction: String, quantityMtrs: Number, unitCost: Number },
        { _id: false }
      ),
    ],
    trims: [lineItem],
    totalEstimatedCost: { type: Number, default: 0 },
  },
  { timestamps: true }
);

bomSchema.plugin(softDeletePlugin);

export default model<IBOMDocument>('BOM', bomSchema);
