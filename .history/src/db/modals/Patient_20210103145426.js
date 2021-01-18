const { DataTypes, Model } = require("sequelize");
import sequelize from "../sequelize";
import File from "./file";
import Visit from "./Visit";

class Patient extends Model {}

Patient.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.DATE,
    },
    gender: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "Patient", // We need to choose the model name
    tableName: "patients",
  }
);

Patient.hasMany(Visit);
Visit.belongsTo(Patient);

Patient.hasMany(File);

export default Patient;
