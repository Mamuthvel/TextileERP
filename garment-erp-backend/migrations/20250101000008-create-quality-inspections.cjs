module.exports = {
  async up(db) {
    await db.createCollection('qualityinspections');
    await db.collection('qualityinspections').createIndex({ orderId: 1 });
    await db.collection('qualityinspections').createIndex({ productionOrderId: 1 });
    await db.collection('qualityinspections').createIndex({ inspectionType: 1 });
    await db.collection('qualityinspections').createIndex({ result: 1 });
  },

  async down(db) {
    await db.collection('qualityinspections').drop().catch(() => {});
  },
};
