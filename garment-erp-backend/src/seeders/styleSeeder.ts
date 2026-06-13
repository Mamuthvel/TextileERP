import Style, { IStyleDocument } from '../models/Style';
import BOM from '../models/BOM';
import { IOrderDocument } from '../models/Order';

export const seedStyles = async (orders: IOrderDocument[]): Promise<IStyleDocument[]> => {
  await Style.deleteMany({});
  await BOM.deleteMany({});

  const styles: IStyleDocument[] = [];
  for (let i = 0; i < orders.length; i++) {
    const style = await Style.create({
      styleNo: `STY-${1000 + i}`,
      orderId: orders[i]._id,
      description: `${orders[i].styleCategory || 'Garment'} for ${orders[i].buyer}`,
      fabric: '100% Cotton Single Jersey',
      fabricGSM: 160 + i * 5,
      trims: ['Main Label', 'Care Label', 'Hang Tag'],
      status: i % 2 === 0 ? 'approved' : 'design',
    });

    const bom = await BOM.create({
      styleId: style._id,
      orderId: orders[i]._id,
      yarns: [{ description: '100% Cotton Yarn', count: '30s', composition: '100% Cotton', quantityKg: 250, unitCost: 320 }],
      fabrics: [{ description: 'Single Jersey Knit Fabric', construction: 'Single Jersey', quantityMtrs: 1800, unitCost: 180 }],
      trims: [
        { description: 'Main Label', uom: 'pcs', quantity: 1900, unitCost: 2 },
        { description: 'Care Label', uom: 'pcs', quantity: 1900, unitCost: 1.5 },
        { description: 'Hang Tag', uom: 'pcs', quantity: 1900, unitCost: 1 },
      ],
      totalEstimatedCost: 250 * 320 + 1800 * 180 + 1900 * 2 + 1900 * 1.5 + 1900 * 1,
    });

    style.bomId = bom._id;
    await style.save();
    styles.push(style);
  }

  console.log(`✅ Seeded ${styles.length} styles with BOM`);
  return styles;
};
