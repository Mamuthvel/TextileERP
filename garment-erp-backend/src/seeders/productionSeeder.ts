import ProductionOrder, { IProductionOrderDocument } from '../models/ProductionOrder';
import { getNextSequence } from '../models/Counter';
import { IOrderDocument } from '../models/Order';
import { IStyleDocument } from '../models/Style';

interface StageConfig {
  stage: string;
  status: 'completed' | 'inProgress' | 'planned';
  actualRatio: number;
}

export const seedProduction = async (
  orders: IOrderDocument[],
  styles: IStyleDocument[]
): Promise<IProductionOrderDocument[]> => {
  await ProductionOrder.deleteMany({});

  const stages: StageConfig[] = [
    { stage: 'knitting', status: 'completed', actualRatio: 1 },
    { stage: 'fabricDyeing', status: 'inProgress', actualRatio: 0.6 },
    { stage: 'sewing', status: 'planned', actualRatio: 0 },
  ];

  const created: IProductionOrderDocument[] = [];
  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    const style = styles[i];
    const planned = order.garmentAssortments.reduce((sum, a) => sum + (a.quantity || 0), 0);

    for (const s of stages) {
      const prodOrderNo = await getNextSequence('productionOrders', 'PROD');
      const actual = Math.round(planned * s.actualRatio);
      const po = await ProductionOrder.create({
        prodOrderNo,
        orderId: order._id,
        styleId: style._id,
        stage: s.stage,
        processUnit: 'Unit-1',
        plannedQuantity: planned,
        actualQuantity: actual,
        supervisor: 'Floor Supervisor',
        machineName:
          s.stage === 'knitting'
            ? 'Circular Knitting M/c 3'
            : s.stage === 'sewing'
            ? 'Single Needle L/S 12'
            : 'Jet Dyeing M/c 2',
        status: s.status,
        dailyProduction: actual > 0 ? [{ date: new Date(), qty: actual, shift: 'Day' }] : [],
      });
      created.push(po);
    }
  }

  console.log(`✅ Seeded ${created.length} production orders`);
  return created;
};
