import { Types } from 'mongoose';
import PurchaseOrder, { IPurchaseOrderDocument } from '../models/PurchaseOrder';
import { getNextSequence } from '../models/Counter';
import { IOrderDocument } from '../models/Order';

export const seedPurchaseOrders = async (
  orders: IOrderDocument[],
  adminId: Types.ObjectId
): Promise<IPurchaseOrderDocument[]> => {
  await PurchaseOrder.deleteMany({});

  const created: IPurchaseOrderDocument[] = [];
  for (let i = 0; i < orders.length; i++) {
    const poNo = await getNextSequence('purchaseOrders', 'PO');
    const items = [
      { description: '100% Cotton Yarn 30s', quantity: 250, uom: 'kg', unitPrice: 320, totalPrice: 250 * 320 },
      { description: 'Single Jersey Fabric', quantity: 1800, uom: 'mtr', unitPrice: 180, totalPrice: 1800 * 180 },
    ];
    const totalAmount = items.reduce((s, it) => s + it.totalPrice, 0);
    const po = await PurchaseOrder.create({
      poNo, orderId: orders[i]._id, vendor: `Vendor Mills ${i + 1}`,
      items, totalAmount, currency: 'INR',
      expectedDelivery: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: i % 2 === 0 ? 'acknowledged' : 'sent',
      createdBy: adminId,
    });
    created.push(po);
  }

  console.log(`✅ Seeded ${created.length} purchase orders`);
  return created;
};
