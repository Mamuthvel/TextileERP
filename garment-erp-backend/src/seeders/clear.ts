import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db';

import User from '../models/User';
import Counter from '../models/Counter';
import Order from '../models/Order';
import Style from '../models/Style';
import BOM from '../models/BOM';
import PurchaseOrder from '../models/PurchaseOrder';
import Inventory from '../models/Inventory';
import StockTransaction from '../models/StockTransaction';
import ProductionOrder from '../models/ProductionOrder';
import QualityInspection from '../models/QualityInspection';
import Costing from '../models/Costing';
import Dispatch from '../models/Dispatch';
import Invoice from '../models/Invoice';

dotenv.config();

const run = async (): Promise<void> => {
  await connectDB();
  console.log('🧹 Clearing all collections...');

  await Promise.all([
    User.deleteMany({}),
    Counter.deleteMany({}),
    Order.deleteMany({}),
    Style.deleteMany({}),
    BOM.deleteMany({}),
    PurchaseOrder.deleteMany({}),
    Inventory.deleteMany({}),
    StockTransaction.deleteMany({}),
    ProductionOrder.deleteMany({}),
    QualityInspection.deleteMany({}),
    Costing.deleteMany({}),
    Dispatch.deleteMany({}),
    Invoice.deleteMany({}),
  ]);

  console.log('✅ All collections cleared.');
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('❌ Clear failed:', err);
  process.exit(1);
});
