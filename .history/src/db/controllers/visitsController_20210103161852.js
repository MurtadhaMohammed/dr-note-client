import Visit from "../models/Visit";
import sequelize from "../sequelize";
const { Op } = require("sequelize");

export const createVisit = async (data, callback) => {
    sequelize
        .sync()
        .then(async () => {
            Visit.create(data)
                .then((result) => callback(true))
                .catch((err) => {
                    console.log('err', err)
                    callback(false);
                });
        })
        .catch((e) => callback(false));
};

export const getVisits = async (page, query, callback) => {
    const offset = (page - 1) * 8;
    const limit = 8;

    let paginate = {
        where: {
            [Op.and]: [
                { date: { [Op.like]: `%${query}%` } },
            ],
        },
        limit,
        offset,
        order: [["id", "DESC"]],
    };
    const total = await Visit.count(paginate);
    const visits = await Visit.findAll(paginate);
    if (visits.every((visit) => Visit instanceof Visit)) {
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
