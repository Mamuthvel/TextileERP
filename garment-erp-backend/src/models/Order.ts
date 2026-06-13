import { Schema, model, Document, Model, Types } from 'mongoose';
import { softDeletePlugin } from '../utils/softDeletePlugin';
import { ORDER_STATUS, OrderStatus } from '../config/constants';

interface IAssortment {
  size: string;
  color: string;
  quantity: number;
}

interface ITimeline {
  event: string;
  note?: string;
  by?: Types.ObjectId;
  at: Date;
}

interface ILCDetails {
  lcNo?: string;
  lcDate?: Date;
  expiryDate?: Date;
  bank?: string;
}

export interface IOrderDocument extends Document {
  orderNo?: string;
  type: 'sample' | 'bulk';
  buyer: string;
  agent?: string;
  styleCategory?: string;
  season?: string;
  deliveryDate?: Date;
  destination?: string;
  garmentAssortments: IAssortment[];
  status: OrderStatus;
  lcDetails?: ILCDetails;
  agentCommission: number;
  remarks?: string;
  orderTimeline: ITimeline[];
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  totalQuantity: number;
}

const assortmentSchema = new Schema<IAssortment>(
  { size: String, color: String, quantity: Number },
  { _id: false }
);

const timelineSchema = new Schema<ITimeline>(
  {
    event: String,
    note: String,
    by: { type: Schema.Types.ObjectId, ref: 'User' },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrderDocument>(
  {
    orderNo: { type: String, unique: true },
    type: { type: String, enum: ['sample', 'bulk'], default: 'bulk' },
    buyer: { type: String, required: true },
    agent: String,
    styleCategory: String,
    season: String,
    deliveryDate: Date,
    destination: String,
    garmentAssortments: [assortmentSchema],
    status: { type: String, enum: ORDER_STATUS, default: 'enquiry' },
    lcDetails: {
      lcNo: String,
      lcDate: Date,
      expiryDate: Date,
      bank: String,
    },
    agentCommission: { type: Number, default: 0 },
    remarks: String,
    orderTimeline: [timelineSchema],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

orderSchema.virtual('totalQuantity').get(function (this: IOrderDocument) {
  return (this.garmentAssortments || []).reduce((sum, a) => sum + (a.quantity || 0), 0);
});

orderSchema.set('toJSON', { virtuals: true });
orderSchema.plugin(softDeletePlugin);

export default model<IOrderDocument>('Order', orderSchema);
