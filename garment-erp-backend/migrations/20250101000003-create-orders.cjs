module.exports = {
  async up(db) {
    await db.createCollection('orders');
    await db.collection('orders').createIndex({ orderNo: 1 }, { unique: true });
    await db.collection('orders').createIndex({ status: 1 });
    await db.collection('orders').createIndex({ buyer: 1 });
  },

  async down(db) {
    await db.collection('orders').drop().catch(() => {});
  },
};
