const { DataTypes, Model } = require("sequelize");
import sequelize from "../sequelize";

class Visit extends Model {}

Visit.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    diagnosis: {
      type: DataTypes.STRING,
    },
    // drug name
    pres: {
      type: DataTypes.STRING,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "Visit", // We need to choose the model name
    tableName: "visits",
  }
);

export default Visit;
