const config = {
  app: {
    port: process.env.PORT || 3000,
  },
  pattern: {
    username: /^[a-z0-9_-]{4,16}$/,
    password: /(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/,
    email: /^([a-z0-9_\.\+-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
    bio: /^[^\n]{2,100}$/,
  },
  jwtSecrets: {
    accessTokenSecretKey: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    refreshTokenSecretKey: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
  },
  db: {
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS,
    dbName: process.env.DB_NAME,
  },
  dbTest: {
    dbHost: process.env.DB_HOST_TEST,
    dbPort: process.env.DB_PORT_TEST,
    dbUser: process.env.DB_USER_TEST,
    dbPass: process.env.DB_PASS_TEST,
    dbName: process.env.DB_NAME_TEST,
  },
};

module.exports = config;
