require("dotenv").config(); // Nếu bạn dùng dotenv để bảo mật thông tin

module.exports = {
  development: {
    username: process.env.DB_USER || "medicaldata_ykry_user",
    password: process.env.DB_PASS || "zgexHxWgVfeTlyF7LI0VnXUgyGD9KRMk",
    database: process.env.DB_NAME || "medicaldata_ykry",
    host: process.env.DB_HOST || "dpg-cv4olg2n91rc73e45hf0-a.singapore-postgres.render.com",
    dialect: "postgres",
    port: process.env.DB_PORT || 5432,
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
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || null,
    database: process.env.DB_NAME || "database_test",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql"
  },
  production: {
    username: process.env.DB_USER || "medicaldata_ykry_user",
    password: process.env.DB_PASS || "zgexHxWgVfeTlyF7LI0VnXUgyGD9KRMk",
    database: process.env.DB_NAME || "medicaldata_ykry",
    host: process.env.DB_HOST || "dpg-cv4olg2n91rc73e45hf0-a.singapore-postgres.render.com",
    dialect: "postgres",
    port: process.env.DB_PORT || 5432,
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
