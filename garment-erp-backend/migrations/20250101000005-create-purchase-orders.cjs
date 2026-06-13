module.exports = {
  async up(db) {
    await db.createCollection('purchaseorders');
    await db.collection('purchaseorders').createIndex({ poNo: 1 }, { unique: true });
    await db.collection('purchaseorders').createIndex({ orderId: 1 });
    await db.collection('purchaseorders').createIndex({ status: 1 });
  },

  async down(db) {
    await db.collection('purchaseorders').drop().catch(() => {});
  },
};
