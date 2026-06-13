import { Types } from 'mongoose';
import QualityInspection, { IQualityInspectionDocument } from '../models/QualityInspection';
import { IOrderDocument } from '../models/Order';
import { IProductionOrderDocument } from '../models/ProductionOrder';

export const seedQuality = async (
  orders: IOrderDocument[],
  productionOrders: IProductionOrderDocument[],
  inspectorId: Types.ObjectId
): Promise<IQualityInspectionDocument[]> => {
  await QualityInspection.deleteMany({});

  const created: IQualityInspectionDocument[] = [];
  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    const po = productionOrders.find(
      (p) => String(p.orderId) === String(order._id) && p.stage === 'knitting'
    );

    const defects = i % 2 === 0 ? [{ defectType: 'Oil Stain', count: 2 }, { defectType: 'Hole', count: 1 }] : [];
    const totalDefects = defects.reduce((s, d) => s + d.count, 0);

    const inspection = await QualityInspection.create({
      inspectionType: 'fabricInspection',
      orderId: order._id,
      productionOrderId: po?._id,
      inspectionDate: new Date(),
      inspector: inspectorId,
      sampleSize: 100,
      defectsFound: defects,
      totalDefects,
      result: totalDefects > 2 ? 'conditional' : 'pass',
      remarks: 'Seeded inspection record',
    });
    created.push(inspection);
  }

  console.log(`✅ Seeded ${created.length} quality inspections`);
  return created;
};
