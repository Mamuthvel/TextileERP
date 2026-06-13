import { softDeletePlugin } from '../utils/softDeletePlugin';
import { Schema, model, Document, Types } from 'mongoose';

export interface IStyleDocument extends Document {
  styleNo: string;
  orderId?: Types.ObjectId;
  description?: string;
  fabric?: string;
  fabricGSM?: number;
  trims: string[];
  techPack?: string;
  bomId?: Types.ObjectId;
  status: 'design' | 'approved' | 'inProduction';
  designLibraryRef?: string;
  createdAt: Date;
  updatedAt: Date;
}

const styleSchema = new Schema<IStyleDocument>(
  {
    styleNo: { type: String, required: true, unique: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    description: String,
    fabric: String,
    fabricGSM: Number,
    trims: [String],
    techPack: String,
    bomId: { type: Schema.Types.ObjectId, ref: 'BOM' },
    status: { type: String, enum: ['design', 'approved', 'inProduction'], default: 'design' },
    designLibraryRef: String,
  },
  { timestamps: true }
);

styleSchema.plugin(softDeletePlugin);

export default model<IStyleDocument>('Style', styleSchema);
