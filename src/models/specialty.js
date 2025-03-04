"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Specialty extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Specialty.init(
        {
            specialtyId: DataTypes.INTEGER,
            name: DataTypes.STRING,
            descriptionMarkdown: DataTypes.STRING,
            descriptionHTML: DataTypes.STRING,
            description: DataTypes.STRING,
            image: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Specialty",
        }
    );
    return Specialty;
};
