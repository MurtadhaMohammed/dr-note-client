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


export const getfile = async (page, patientId, callback) => {
    const offset = (page - 1) * 8;
    const limit = 8;

    let paginate = {
        where: {
            [Op.and]: [
                { PatientId: { [Op.like]: `%${patientId}%` } },
            ],
        },
        limit,
        offset,
        order: [["id", "DESC"]],
    };
    const total = await File.count(paginate);
    const files = await File.findAll(paginate);
    if (files.every((file) => file instanceof File)) {
        callback({
            status: true,
            files: JSON.parse(JSON.stringify(files, null, 2)),
            total,
            pages: Math.ceil(total / limit),
        });
    } else {
        callback({ status: false });
    }
};