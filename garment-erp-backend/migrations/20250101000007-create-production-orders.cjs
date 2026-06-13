module.exports = {
  async up(db) {
    await db.createCollection('productionorders');
    await db.collection('productionorders').createIndex({ prodOrderNo: 1 }, { unique: true });
    await db.collection('productionorders').createIndex({ orderId: 1 });
    await db.collection('productionorders').createIndex({ stage: 1 });
    await db.collection('productionorders').createIndex({ status: 1 });
  },

  async down(db) {
    await db.collection('productionorders').drop().catch(() => {});
  },
};
