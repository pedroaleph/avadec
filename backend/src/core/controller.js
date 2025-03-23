const { statusCode } = require('./constants');
const service = require('./service');

const getStations = async (req, res) => {
    try {
        const items = await service.findStations();

        res.status(statusCode.ok).send(items);
    } catch (error) {
        console.error(error);
        res.status(statusCode.badResquest).send({
            message: 'Não foi possivel buscar estações.',
        });
    }
};

const getOneStation = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const item = await service.findOneStation(id);

        res.status(statusCode.ok).send(item);
    } catch (error) {
        console.error(error);
        res.status(statusCode.badResquest).send({
            message: 'Não foi possivel buscar estação.',
        });
    }
};

const getDailyData = async (req, res) => {
    const id = parseInt(req.params.id);
    const params = req.query;

    try {
        const items = await service.findDailyData(id, params);

        res.status(statusCode.ok).send(items);
    } catch (error) {
        console.error(error);
        res.status(statusCode.badResquest).send({
            message: 'Não foi possivel buscar dados diários.',
        });
    }
};

module.exports = {
    getStations,
    getOneStation,
    getDailyData,
};
