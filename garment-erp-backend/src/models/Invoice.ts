import { softDeletePlugin } from '../utils/softDeletePlugin';
import { Schema, model, Document, Types } from 'mongoose';

interface IInvoiceItem {
  description?: string;
  quantity?: number;
  unitPrice?: number;
  amount?: number;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export interface IInvoiceDocument extends Document {
  invoiceNo?: string;
  orderId?: Types.ObjectId;
  dispatchId?: Types.ObjectId;
  buyer?: string;
  items: IInvoiceItem[];
  totalAmount: number;
  currency: string;
  dutyDrawback: number;
  creditAdvice: number;
  status: InvoiceStatus;
  invoiceDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceItemSchema = new Schema<IInvoiceItem>(
  { description: String, quantity: Number, unitPrice: Number, amount: Number },
  { _id: false }
);

const invoiceSchema = new Schema<IInvoiceDocument>(
  {
    invoiceNo: { type: String, unique: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    dispatchId: { type: Schema.Types.ObjectId, ref: 'Dispatch' },
    buyer: String,
    items: [invoiceItemSchema],
    totalAmount: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    dutyDrawback: { type: Number, default: 0 },
    creditAdvice: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'sent', 'paid', 'overdue'], default: 'draft' },
    invoiceDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

invoiceSchema.plugin(softDeletePlugin);

export default model<IInvoiceDocument>('Invoice', invoiceSchema);
