import File from "../models/File";
import sequelize from "../sequelize";
const { Op } = require("sequelize");



export const AddFile = async (data, callback) => {
    sequelize
        .sync()
        .then(async () => {
            File.create(data)
                .then((result) => callback(true))
                .catch((err) => {
                    console.log('err', err)
                    callback(false);
                });
        })
        .catch((e) => callback(false));
};