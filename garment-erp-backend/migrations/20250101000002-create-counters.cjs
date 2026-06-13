module.exports = {
  async up(db) {
    await db.createCollection('counters');
  },

  async down(db) {
    await db.collection('counters').drop().catch(() => {});
  },
};
