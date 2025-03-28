const { statusCode } = require('../constants');
const controller = require('../controller');
const service = require('../service');

jest.mock('../service');

describe('Controller', () => {
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should get stations', async () => {
        // Given
        const req = {};
        const data = [{ modulo_id: 1 }];
        service.findStations.mockResolvedValueOnce(data);

        // When
        await controller.getStations(req, res);

        // Then
        expect(service.findStations).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(statusCode.ok);
        expect(res.send).toHaveBeenCalledWith(data);
    });

    it('should send bad request when error is thrown while trying to get stations', async () => {
        // Given
        const req = {};
        service.findStations.mockRejectedValueOnce();

        // When
        await controller.getStations(req, res);

        // Then
        expect(service.findStations).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(statusCode.badResquest);
        expect(res.send).toHaveBeenCalledWith({
            message: 'Não foi possivel buscar estações.',
        });
    });

    it('should get one station', async () => {
        // Given
        const req = { params: { id: '1' } };
        const item = { modulo_id: 1 };
        service.findOneStation.mockResolvedValueOnce(item);

        // When
        await controller.getOneStation(req, res);

        // Then
        expect(service.findOneStation).toHaveBeenCalledWith(
            parseInt(req.params.id)
        );
        expect(res.status).toHaveBeenCalledWith(statusCode.ok);
        expect(res.send).toHaveBeenCalledWith(item);
    });

    it('should send bad request when error is thrown while trying to get one station', async () => {
        // Given
        const req = { params: { id: '1' } };
        service.findOneStation.mockRejectedValueOnce();

        // When
        await controller.getOneStation(req, res);

        // Then
        expect(service.findOneStation).toHaveBeenCalledWith(
            parseInt(req.params.id)
        );
        expect(res.status).toHaveBeenCalledWith(statusCode.badResquest);
        expect(res.send).toHaveBeenCalledWith({
            message: 'Não foi possivel buscar estação.',
        });
    });

    it('should get daily data', async () => {
        // Given
        const req = {
            params: { id: '1' },
            query: {},
        };
        const items = [{ modulo_id: 1 }];
        service.findDailyData.mockResolvedValueOnce(items);

        // When
        await controller.getDailyData(req, res);

        // Then
        expect(service.findDailyData).toHaveBeenCalledWith(
            parseInt(req.params.id),
            req.query
        );
        expect(res.status).toHaveBeenCalledWith(statusCode.ok);
        expect(res.send).toHaveBeenCalledWith(items);
    });

    it('should send bad request when error is thrown while trying to get one station', async () => {
        // Given
        const req = {
            params: { id: '1' },
            query: {},
        };
        service.findDailyData.mockRejectedValueOnce();

        // When
        await controller.getDailyData(req, res);

        // Then
        expect(service.findDailyData).toHaveBeenCalledWith(
            parseInt(req.params.id),
            req.query
        );
        expect(res.status).toHaveBeenCalledWith(statusCode.badResquest);
        expect(res.send).toHaveBeenCalledWith({
            message: 'Não foi possivel buscar dados diários.',
        });
    });
});
