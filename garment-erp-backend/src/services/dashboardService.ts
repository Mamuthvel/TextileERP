import Order from '../models/Order';
import Inventory from '../models/Inventory';
import ProductionOrder from '../models/ProductionOrder';
import Costing from '../models/Costing';

export const dashboardService = {
  getSummary: async () => {
    const [totalOrders, inProduction, dispatched, lowStockCount, productionByStage] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'inProduction' }),
      Order.countDocuments({ status: 'dispatched' }),
      Inventory.countDocuments({ $expr: { $lte: ['$currentStock', '$minStockLevel'] } }),
      ProductionOrder.aggregate([
        {
          $group: {
            _id: '$stage',
            planned: { $sum: '$plannedQuantity' },
            actual: { $sum: '$actualQuantity' },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const costings = await Costing.find();
    const pnl = costings.reduce(
      (acc, c) => {
        acc.totalCost += c.totalCost || 0;
        acc.totalRevenue += c.sellingPrice || 0;
        return acc;
      },
      { totalCost: 0, totalRevenue: 0, profit: 0 }
    );
    pnl.profit = pnl.totalRevenue - pnl.totalCost;

    return {
      kpis: { totalOrders, inProduction, dispatched, lowStockCount },
      productionByStage,
      pnl,
    };
  },

  getOrderSummaryReport: async () => {
    const [byBuyer, bySeason] = await Promise.all([
      Order.aggregate([
        { $group: { _id: '$buyer', orders: { $sum: 1 }, status: { $push: '$status' } } },
        { $sort: { orders: -1 } },
      ]),
      Order.aggregate([
        { $group: { _id: '$season', orders: { $sum: 1 } } },
      ]),
    ]);
    return { byBuyer, bySeason };
  },

  getProductionEfficiencyReport: async () => {
    return ProductionOrder.aggregate([
      {
        $group: {
          _id: '$stage',
          plannedQuantity: { $sum: '$plannedQuantity' },
          actualQuantity: { $sum: '$actualQuantity' },
        },
      },
      {
        $project: {
          stage: '$_id',
          _id: 0,
          plannedQuantity: 1,
          actualQuantity: 1,
          efficiency: {
            $cond: [
              { $eq: ['$plannedQuantity', 0] },
              0,
              { $multiply: [{ $divide: ['$actualQuantity', '$plannedQuantity'] }, 100] },
            ],
          },
        },
      },
    ]);
  },

  getInventoryAgingReport: async (query: Record<string, unknown>) => {
    const filter: Record<string, unknown> = {};
    if (query.category) filter.category = query.category;
    const minAge = parseInt(String(query.minAge || 0)) || 0;

    const items = await Inventory.find(filter).sort('updatedAt');
    let data = items.map((i) => ({
      itemCode: i.itemCode,
      description: i.description,
      category: i.category,
      currentStock: i.currentStock,
      lastUpdated: i.updatedAt,
      ageDays: Math.floor((Date.now() - new Date(i.updatedAt).getTime()) / (1000 * 60 * 60 * 24)),
    }));

    if (minAge > 0) data = data.filter((i) => i.ageDays >= minAge);
    const total = data.length;

    if (query.all === 'true') return { data, pagination: null };

    const page = Math.max(parseInt(String(query.page ?? 1)) || 1, 1);
    const limit = Math.min(parseInt(String(query.limit ?? 20)) || 20, 100);
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data: data.slice(skip, skip + limit),
      pagination: { page, limit, total, totalPages },
    };
  },
};
