const config = {
  app: {
    port: process.env.PORT || 3000,
  },
  db: {
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS,
    dbName: process.env.DB_NAME,
  },
};

module.exports = config;
