const dataSource = require('./data-source');
const utils = require('./utils');

const getStations = async (req, res) => {
    const pipeline = [
        {
            $match: {
                online: 1,
                tipo: 'estacao',
            },
        },
        ...utils.getStationPipeline(),
    ];

    try {
        const itens = await dataSource
            .db()
            .collection('modulos')
            .aggregate(pipeline)
            .sort({ modulo_id: 1 })
            .toArray();

        return res.send(itens);
    } catch (error) {
        console.error(error);
        return res
            .status(400)
            .send({ message: 'Não foi possivel buscar estações.' });
    }
};

const getOneStation = async (req, res) => {
    const { id } = req.params;
    const pipeline = [
        {
            $match: {
                modulo_id: parseInt(id),
            },
        },
        ...utils.getStationPipeline(),
    ];

    try {
        const item = await dataSource
            .db()
            .collection('modulos')
            .aggregate(pipeline)
            .toArray();

        return res.send(item[0]);
    } catch (error) {
        console.error(error);
        return res
            .status(400)
            .send({ message: 'Não foi possivel buscar estação.' });
    }
};

const getDailyData = async (req, res) => {
    try {
        const { id } = req.params;
        const { start, end, period } = req.query;
        const conditions = { modulo_id: parseInt(id) };

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

        return res.send(result);
    } catch (error) {
        console.error(error);
        return res
            .status(400)
            .send({ message: 'Não foi possivel buscar dados diários.' });
    }
};

module.exports = {
    getStations,
    getOneStation,
    getDailyData,
};
