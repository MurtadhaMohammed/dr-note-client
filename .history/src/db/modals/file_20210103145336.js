const { DataTypes, Model } = require("sequelize");
import sequelize from "../sequelize";


class File extends Model { }

File.init(
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
        }
    },
    {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: "File", // We need to choose the model name
        tableName: "files",
    }
);

export default File;
