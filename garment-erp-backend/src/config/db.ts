import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/garment-erp';
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('❌ MongoDB connection error:', message);
    process.exit(1);
  }
};
