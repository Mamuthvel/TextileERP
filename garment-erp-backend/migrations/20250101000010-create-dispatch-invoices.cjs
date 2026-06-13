module.exports = {
  async up(db) {
    await db.createCollection('dispatches');
    await db.collection('dispatches').createIndex({ dispatchNo: 1 }, { unique: true });
    await db.collection('dispatches').createIndex({ orderId: 1 });
    await db.collection('dispatches').createIndex({ shippingStatus: 1 });

    await db.createCollection('invoices');
    await db.collection('invoices').createIndex({ invoiceNo: 1 }, { unique: true });
    await db.collection('invoices').createIndex({ orderId: 1 });
    await db.collection('invoices').createIndex({ status: 1 });
  },

  async down(db) {
    await db.collection('dispatches').drop().catch(() => {});
    await db.collection('invoices').drop().catch(() => {});
  },
};
