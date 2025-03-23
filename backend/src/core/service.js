const dataSource = require('./data-source');
const utils = require('./utils');

const findStations = async () => {
    const pipeline = [
        {
            $match: {
                online: 1,
                tipo: 'estacao',
            },
        },
        ...utils.getStationPipeline(),
    ];

    const items = await dataSource
        .db()
        .collection('modulos')
        .aggregate(pipeline)
        .sort({ modulo_id: 1 })
        .toArray();

    return items;
};

const findOneStation = async (id) => {
    const pipeline = [
        {
            $match: {
                modulo_id: id,
            },
        },
        ...utils.getStationPipeline(),
    ];

    const item = await dataSource
        .db()
        .collection('modulos')
        .aggregate(pipeline)
        .toArray();

    return item[0];
};

const findDailyData = async (id, params) => {
    const { start, end, period } = params;
    const conditions = { modulo_id: id };

    if (start || end) {
        conditions.data = {};

        if (start) {
            conditions.data.$gte = new Date(start);
        }

        if (end) {
            conditions.data.$lte = new Date(end);
        }
    }

    const item = await dataSource
        .db()
        .collection('dadosdiariosestacaos')
        .find(conditions)
        .sort({ data: 1 })
        .toArray();

    const result = utils.transformDataByPeriod(item, period);

    return result;
};

module.exports = {
    findStations,
    findOneStation,
    findDailyData,
};
