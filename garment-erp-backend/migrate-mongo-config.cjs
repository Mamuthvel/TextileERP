require('dotenv').config();

const config = {
  mongodb: {
    url: process.env.MONGODB_URI || "mongodb+srv://mamuthvel:ir66rOWq0tvRdJGV@cluster0.wwjn6oq.mongodb.net/?appName=garment-erp",
    databaseName: process.env.MONGODB_DB || 'garment-erp',
    options: {},
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.cjs',
  useFileHash: false,
  moduleSystem: 'commonjs',
};

module.exports = config;
