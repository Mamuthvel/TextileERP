module.exports = {
  async up(db) {
    await db.createCollection('inventories');
    await db.collection('inventories').createIndex({ itemCode: 1 }, { unique: true });
    await db.collection('inventories').createIndex({ category: 1 });

    await db.createCollection('stocktransactions');
    await db.collection('stocktransactions').createIndex({ inventoryId: 1 });
    await db.collection('stocktransactions').createIndex({ orderId: 1 });
    await db.collection('stocktransactions').createIndex({ transactionType: 1 });
  },

  async down(db) {
    await db.collection('inventories').drop().catch(() => {});
    await db.collection('stocktransactions').drop().catch(() => {});
  },
};
