module.exports = {
  async up(db) {
    await db.createCollection('styles');
    await db.collection('styles').createIndex({ styleNo: 1 }, { unique: true });
    await db.collection('styles').createIndex({ orderId: 1 });

    await db.createCollection('boms');
    await db.collection('boms').createIndex({ styleId: 1 }, { unique: true });
  },

  async down(db) {
    await db.collection('styles').drop().catch(() => {});
    await db.collection('boms').drop().catch(() => {});
  },
};
