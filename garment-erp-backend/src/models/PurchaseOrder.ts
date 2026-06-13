import { softDeletePlugin } from '../utils/softDeletePlugin';
import { Schema, model, Document, Types } from 'mongoose';

interface IPOItem {
  description?: string;
  quantity?: number;
  uom?: string;
  unitPrice?: number;
  totalPrice?: number;
}

export type POStatus = 'draft' | 'sent' | 'acknowledged' | 'partiallyReceived' | 'fullyReceived' | 'closed';

export interface IPurchaseOrderDocument extends Document {
  poNo?: string;
  orderId?: Types.ObjectId;
  vendor: string;
  items: IPOItem[];
  totalAmount: number;
  currency: string;
  expectedDelivery?: Date;
  status: POStatus;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema<IPOItem>(
  {
    description: String,
    quantity: Number,
    uom: String,
    unitPrice: Number,
    totalPrice: Number,
  },
  { _id: false }
);

const poSchema = new Schema<IPurchaseOrderDocument>(
  {
    poNo: { type: String, unique: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    vendor: { type: String, required: true },
    items: [itemSchema],
    totalAmount: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    expectedDelivery: Date,
    status: {
      type: String,
      enum: ['draft', 'sent', 'acknowledged', 'partiallyReceived', 'fullyReceived', 'closed'],
      default: 'draft',
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

poSchema.plugin(softDeletePlugin);

export default model<IPurchaseOrderDocument>('PurchaseOrder', poSchema);
