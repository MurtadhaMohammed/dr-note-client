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


export const getDrug = async (page, callback) => {
    const offset = (page - 1) * 8;
    const limit = 8;

    let paginate = {
        limit,
        offset,
        order: [["id", "DESC"]],
    };
    const total = await Drug.count(paginate);
    const drugs = await Drug.findAll(paginate);
    if (drugs.every((drug) => drug instanceof Visit)) {
        callback({
            status: true,
            visits: JSON.parse(JSON.stringify(visits, null, 2)),
            total,
            pages: Math.ceil(total / limit),
        });
    } else {
        callback({ status: false });
    }
};