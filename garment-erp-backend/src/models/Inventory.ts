import { softDeletePlugin } from '../utils/softDeletePlugin';
import { Schema, model, Document } from 'mongoose';

export type InventoryCategory = 'yarn' | 'greyFabric' | 'finishedFabric' | 'trim' | 'packingMaterial';

export interface IInventoryDocument extends Document {
  itemCode: string;
  category: InventoryCategory;
  description?: string;
  uom?: string;
  currentStock: number;
  reservedStock: number;
  location?: string;
  minStockLevel: number;
  createdAt: Date;
  updatedAt: Date;
  availableStock: number;
}

const inventorySchema = new Schema<IInventoryDocument>(
  {
    itemCode: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ['yarn', 'greyFabric', 'finishedFabric', 'trim', 'packingMaterial'],
      required: true,
    },
    description: String,
    uom: String,
    currentStock: { type: Number, default: 0 },
    reservedStock: { type: Number, default: 0 },
    location: String,
    minStockLevel: { type: Number, default: 0 },
  },
  { timestamps: true }
);

inventorySchema.virtual('availableStock').get(function (this: IInventoryDocument) {
  return (this.currentStock || 0) - (this.reservedStock || 0);
});

inventorySchema.set('toJSON', { virtuals: true });

inventorySchema.plugin(softDeletePlugin);

export default model<IInventoryDocument>('Inventory', inventorySchema);
