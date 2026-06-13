import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db';

import { seedUsers } from './userSeeder';
import { seedOrders } from './orderSeeder';
import { seedStyles } from './styleSeeder';
import { seedInventory } from './inventorySeeder';
import { seedProduction } from './productionSeeder';
import { seedQuality } from './qualitySeeder';
import { seedCosting } from './costingSeeder';
import { seedPurchaseOrders } from './poSeeder';
import { seedDispatchAndInvoices } from './dispatchInvoiceSeeder';

dotenv.config();

const run = async (): Promise<void> => {
  await connectDB();
  console.log('🌱 Starting full database seed...\n');

  const users = await seedUsers();
  const admin = users.find((u) => u.role === 'superAdmin')!;
  const qcInspector = users.find((u) => u.role === 'qcInspector')!;

  const orders = await seedOrders(admin._id);
  const styles = await seedStyles(orders);
  await seedInventory();
  const productionOrders = await seedProduction(orders, styles);
  await seedQuality(orders, productionOrders, qcInspector._id);
  await seedCosting(orders);
  await seedPurchaseOrders(orders, admin._id);
  await seedDispatchAndInvoices(orders);

  console.log('\n✅ Seed complete.');
  console.log('   Login: admin@garmenterp.com / Admin@123');

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
