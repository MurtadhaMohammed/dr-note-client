import Drug from "../models/Drug";
import sequelize from "../sequelize";
const { Op } = require("sequelize");

export const createDrug = async (data, callback) => {
    sequelize
        .sync()
        .then(async () => {
            Drug.create(data)
                .then((result) => callback(true))
                .catch((err) => {
                    console.log('err', err)
                    callback(false);
                });
        })
        .catch((e) => callback(false));
};