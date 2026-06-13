import { softDeletePlugin } from '../utils/softDeletePlugin';
import { Schema, model, Document, Types } from 'mongoose';

export type TransactionType = 'GRN' | 'issue' | 'transfer' | 'return' | 'adjustment';
export type InspectionResultType = 'passed' | 'failed' | 'conditional';

export interface IStockTransactionDocument extends Document {
  transactionType: TransactionType;
  inventoryId: Types.ObjectId;
  orderId?: Types.ObjectId;
  quantity: number;
  uom?: string;
  reference?: string;
  inspectionResult?: InspectionResultType;
  billNo?: string;
  billAmount?: number;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const stockTxnSchema = new Schema<IStockTransactionDocument>(
  {
    transactionType: {
      type: String,
      enum: ['GRN', 'issue', 'transfer', 'return', 'adjustment'],
      required: true,
    },
    inventoryId: { type: Schema.Types.ObjectId, ref: 'Inventory', required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    quantity: { type: Number, required: true },
    uom: String,
    reference: String,
    inspectionResult: { type: String, enum: ['passed', 'failed', 'conditional'] },
    billNo: String,
    billAmount: Number,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

stockTxnSchema.plugin(softDeletePlugin);

export default model<IStockTransactionDocument>('StockTransaction', stockTxnSchema);
