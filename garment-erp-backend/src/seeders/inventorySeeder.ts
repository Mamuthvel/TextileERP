import Inventory, { IInventoryDocument, InventoryCategory } from '../models/Inventory';

const CATEGORIES: InventoryCategory[] = ['yarn', 'greyFabric', 'finishedFabric', 'trim', 'packingMaterial'];
const UOM_BY_CATEGORY: Record<InventoryCategory, string> = {
  yarn: 'kg',
  greyFabric: 'mtr',
  finishedFabric: 'mtr',
  trim: 'pcs',
  packingMaterial: 'pcs',
};

export const seedInventory = async (): Promise<IInventoryDocument[]> => {
  await Inventory.deleteMany({});

  const items: IInventoryDocument[] = [];
  for (let i = 1; i <= 20; i++) {
    const category = CATEGORIES[i % CATEGORIES.length];
    const item = await Inventory.create({
      itemCode: `ITM-${String(i).padStart(3, '0')}`,
      category,
      description: `${category} item ${i}`,
      uom: UOM_BY_CATEGORY[category],
      currentStock: 100 + i * 10,
      reservedStock: i % 3 === 0 ? 20 : 0,
      location: `Rack-${(i % 5) + 1}`,
      minStockLevel: 50,
    });
    items.push(item);
  }

  console.log(`✅ Seeded ${items.length} inventory items`);
  return items;
};
