import { Schema } from 'mongoose';

export interface SoftDeleteFields {
  isDeleted: boolean;
  deletedAt: Date | null;
  softDelete(): Promise<this>;
}

export function softDeletePlugin(schema: Schema): void {
  // Add soft-delete fields
  schema.add({
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  });

  // Automatically exclude soft-deleted documents from all find queries
  // unless { includeDeleted: true } is passed in query options
  schema.pre(/^find/, function (this: any) {
    if (!this.getOptions().includeDeleted) {
      this.where({ isDeleted: { $ne: true } });
    }
  });

  // Instance method to soft-delete a document
  schema.methods.softDelete = async function (): Promise<typeof this> {
    this.isDeleted = true;
    this.deletedAt = new Date();
    return this.save();
  };
}
