import { softDeletePlugin } from '../utils/softDeletePlugin';
import { Schema, model, Document, Types } from 'mongoose';

interface ICarton {
  cartonNo?: string;
  qty?: number;
  grossWeight?: number;
  netWeight?: number;
}

export type ShippingStatus = 'pending' | 'packed' | 'shipped' | 'delivered';

export interface IDispatchDocument extends Document {
  dispatchNo?: string;
  orderId?: Types.ObjectId;
  lorryNo?: string;
  blNo?: string;
  cartons: ICarton[];
  totalCartons: number;
  totalQuantity: number;
  shippingStatus: ShippingStatus;
  dispatchDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const cartonSchema = new Schema<ICarton>(
  { cartonNo: String, qty: Number, grossWeight: Number, netWeight: Number },
  { _id: false }
);

const dispatchSchema = new Schema<IDispatchDocument>(
  {
    dispatchNo: { type: String, unique: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    lorryNo: String,
    blNo: String,
    cartons: [cartonSchema],
    totalCartons: { type: Number, default: 0 },
    totalQuantity: { type: Number, default: 0 },
    shippingStatus: {
      type: String,
      enum: ['pending', 'packed', 'shipped', 'delivered'],
      default: 'pending',
    },
    dispatchDate: Date,
  },
  { timestamps: true }
);

dispatchSchema.plugin(softDeletePlugin);

export default model<IDispatchDocument>('Dispatch', dispatchSchema);
