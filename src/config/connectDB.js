const { Sequelize } = require("sequelize");

// // Option 3: Passing parameters separately (other dialects)
// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: "mysql",
//     logging: false,
// });

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres", // ✅ Đổi thành PostgreSQL
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // Cần thiết khi dùng Render
        },
    },
});

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

module.exports = connectDB;