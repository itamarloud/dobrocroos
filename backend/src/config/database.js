require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      // ssl: {
      //   require: true, // Esta linha pode ser necessária se você estiver usando SSL com o DB
      //   rejectUnauthorized: false // Esta linha pode ser necessária se o certificado SSL for autoassinado
      // }
    },
  },
  test: {
    username: process.env.DB_USER_TEST || process.env.DB_USER,
    password: process.env.DB_PASSWORD_TEST || process.env.DB_PASSWORD,
    database: process.env.DB_NAME_TEST || `${process.env.DB_NAME}_test`,
    host: process.env.DB_HOST_TEST || process.env.DB_HOST,
    port: process.env.DB_PORT_TEST || process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: process.env.DB_USER_PROD || process.env.DB_USER,
    password: process.env.DB_PASSWORD_PROD || process.env.DB_PASSWORD,
    database: process.env.DB_NAME_PROD || process.env.DB_NAME,
    host: process.env.DB_HOST_PROD || process.env.DB_HOST,
    port: process.env.DB_PORT_PROD || process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      // ssl: {
      //   require: true,
      //   rejectUnauthorized: false
      // }
    },
  },
};
