const { DataTypes, Model } = require("sequelize");
import sequelize from "../sequelize";

class Drug extends Model { }

Drug.init(
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
        color: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: "Drug", // We need to choose the model name
        tableName: "drugs",
    }
);

export default Drug;