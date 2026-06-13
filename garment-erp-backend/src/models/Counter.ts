import { Schema, model, Model } from 'mongoose';

interface ICounter {
  _id: string;
  seq: number;
}

const counterSchema = new Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter: Model<ICounter> = model<ICounter>('Counter', counterSchema as never);

export const getNextSequence = async (key: string, prefix: string): Promise<string> => {
  const year = new Date().getFullYear();
  const id = `${key}-${year}`;
  const result = await Counter.findByIdAndUpdate(
    id,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const padded = String(result!.seq).padStart(4, '0');
  return `${prefix}-${year}-${padded}`;
};

export default Counter;
