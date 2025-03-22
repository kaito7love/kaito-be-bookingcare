require("dotenv").config(); // Nếu bạn dùng dotenv để bảo mật thông tin

module.exports = {
  development: {
    username: process.env.DB_USER ,
    password: process.env.DB_PASS ,
    database: process.env.DB_NAME ,
    host: process.env.DB_HOST ,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT ,
    logging: false,
    timezone: "+07:00",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  },
  test: {
    username: process.env.DB_USER ,
    password: process.env.DB_PASS ,
    database: process.env.DB_NAME ,
    host: process.env.DB_HOST,
    dialect: "mysql"
  },
  production: {
    username: process.env.DB_USER ,
    password: process.env.DB_PASS ,
    database: process.env.DB_NAME ,
    host: process.env.DB_HOST ,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT ,
    logging: false,
    timezone: "+07:00",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
