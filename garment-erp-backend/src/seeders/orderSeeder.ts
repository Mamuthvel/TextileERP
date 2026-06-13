import { Types } from 'mongoose';
import Order, { IOrderDocument } from '../models/Order';
import { getNextSequence } from '../models/Counter';

const STATUSES = ['enquiry', 'quotation', 'confirmed', 'inProduction', 'dispatched'] as const;
const BUYERS = ['H&M', 'Zara', 'Decathlon', 'Marks & Spencer', 'Uniqlo'];

export const seedOrders = async (adminId: Types.ObjectId): Promise<IOrderDocument[]> => {
  await Order.deleteMany({});

  const orders: IOrderDocument[] = [];
  for (let i = 0; i < BUYERS.length; i++) {
    const orderNo = await getNextSequence('orders', 'ORD');
    const order = await Order.create({
      orderNo,
      type: i % 2 === 0 ? 'bulk' : 'sample',
      buyer: BUYERS[i],
      agent: `Agent ${i + 1}`,
      styleCategory: 'T-Shirts',
      season: 'SS25',
      deliveryDate: new Date(Date.now() + (30 + i * 10) * 24 * 60 * 60 * 1000),
      destination: 'Hamburg, Germany',
      garmentAssortments: [
        { size: 'S', color: 'White', quantity: 500 },
        { size: 'M', color: 'White', quantity: 800 },
        { size: 'L', color: 'Black', quantity: 600 },
      ],
      status: STATUSES[i],
      agentCommission: 2.5,
      remarks: 'Seeded sample order',
      createdBy: adminId,
      orderTimeline: [{ event: 'Order Created', by: adminId, at: new Date() }],
    });
    orders.push(order);
  }

  console.log(`✅ Seeded ${orders.length} orders`);
  return orders;
};
