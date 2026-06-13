import Dispatch, { IDispatchDocument } from '../models/Dispatch';
import Invoice, { IInvoiceDocument } from '../models/Invoice';
import { getNextSequence } from '../models/Counter';
import { IOrderDocument } from '../models/Order';

export const seedDispatchAndInvoices = async (
  orders: IOrderDocument[]
): Promise<{ dispatches: IDispatchDocument[]; invoices: IInvoiceDocument[] }> => {
  await Dispatch.deleteMany({});
  await Invoice.deleteMany({});

  const dispatches: IDispatchDocument[] = [];
  const invoices: IInvoiceDocument[] = [];

  const dispatchable = orders.filter((o) =>
    ['dispatched', 'invoiced', 'closed'].includes(o.status)
  );

  for (const order of dispatchable) {
    const dispatchNo = await getNextSequence('dispatches', 'DISP');
    const cartons = [
      { cartonNo: 'CTN-001', qty: 100, grossWeight: 22.5, netWeight: 20 },
      { cartonNo: 'CTN-002', qty: 100, grossWeight: 22.5, netWeight: 20 },
    ];
    const totalQuantity = cartons.reduce((s, c) => s + c.qty, 0);

    const dispatch = await Dispatch.create({
      dispatchNo, orderId: order._id, lorryNo: 'TN-25-AB-1234',
      blNo: `BL-${dispatchNo}`, cartons, totalCartons: cartons.length,
      totalQuantity, shippingStatus: 'shipped', dispatchDate: new Date(),
    });
    dispatches.push(dispatch);

    const invoiceNo = await getNextSequence('invoices', 'INV');
    const items = [{
      description: `${order.styleCategory || 'Garments'} - Order ${order.orderNo}`,
      quantity: totalQuantity, unitPrice: 4.5, amount: totalQuantity * 4.5,
    }];
    const totalAmount = items.reduce((s, it) => s + it.amount, 0);

    const invoice = await Invoice.create({
      invoiceNo, orderId: order._id, dispatchId: dispatch._id, buyer: order.buyer,
      items, totalAmount, currency: 'USD',
      dutyDrawback: Math.round(totalAmount * 0.02), creditAdvice: 0,
      status: 'sent', invoiceDate: new Date(),
    });
    invoices.push(invoice);
  }

  console.log(`✅ Seeded ${dispatches.length} dispatches and ${invoices.length} invoices`);
  return { dispatches, invoices };
};
