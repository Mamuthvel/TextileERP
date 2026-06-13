module.exports = {
  async up(db) {
    await db.createCollection('costings');
    await db.collection('costings').createIndex({ orderId: 1, type: 1 });
  },

  async down(db) {
    await db.collection('costings').drop().catch(() => {});
  },
};
