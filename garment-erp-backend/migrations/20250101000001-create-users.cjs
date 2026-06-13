module.exports = {
  async up(db) {
    await db.createCollection('users');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });
  },

  async down(db) {
    await db.collection('users').dropIndexes();
    await db.collection('users').drop().catch(() => {});
  },
};
