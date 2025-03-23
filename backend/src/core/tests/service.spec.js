const service = require('../service');
const dataSource = require('../data-source');
const { stationPipeline } = require('../constants');
const { transformDataByPeriod } = require('../utils');

jest.mock('../data-source');
jest.mock('../utils');

const mockSort = (field, data) => {
    const items = [...data];

    switch (field) {
        case 'modulo_id':
            items.sort((a, b) => a.modulo_id - b.modulo_id);
            break;
        case 'data':
            items.sort((a, b) => new Date(a.data) - new Date(b.data));
            break;
        default:
            break;
    }

    return items;
};

const mockFind = (fields, data) => {
    const items = [...data];
    const { id, start, end } = fields;

    const checkId = id ? (item) => item.modulo_id === id : () => true;
    const checkStart = start
        ? (item) => new Date(item.data).getTime() >= new Date(start).getTime()
        : () => true;
    const checkEnd = end
        ? (item) => new Date(item.data).getTime() <= new Date(end).getTime()
        : () => true;

    return items.filter((item) => {
        return checkId(item) && checkStart(item) && checkEnd(item);
    });
};

const mockFindDailyData = (id, params, data) => {
    const filtered = mockFind(
        { id, start: params.start, end: params.end },
        data
    );
    const sorted = mockSort('data', filtered);

    return sorted;
};

describe('Service', () => {
    const mockCollection = {
        find: jest.fn().mockReturnThis(),
        aggregate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockReturnThis(),
    };

    dataSource.db.mockReturnValue({
        collection: jest.fn().mockReturnValue(mockCollection),
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should find stations', async () => {
        // Given
        const pipeline = [
            {
                $match: {
                    online: 1,
                    tipo: 'estacao',
                },
            },
            ...stationPipeline,
        ];
        const data = [{ modulo_id: 2 }, { modulo_id: 1 }];
        mockCollection.toArray.mockReturnValueOnce(mockSort('modulo_id', data));

        // When
        const result = await service.findStations();

        // Then
        expect(dataSource.db().collection).toHaveBeenCalledWith('modulos');
        expect(mockCollection.aggregate).toHaveBeenCalledWith(pipeline);
        expect(mockCollection.sort).toHaveBeenCalledWith({ modulo_id: 1 });
        expect(mockCollection.toArray).toHaveBeenCalledTimes(1);
        expect(result).toEqual([{ modulo_id: 1 }, { modulo_id: 2 }]);
    });

    it('should find one station', async () => {
        // Given
        const id = 1;
        const pipeline = [
            {
                $match: {
                    modulo_id: id,
                },
            },
            ...stationPipeline,
        ];
        const data = [{ modulo_id: 1 }, { modulo_id: 2 }];
        mockCollection.toArray.mockReturnValueOnce(mockFind({ id }, data));

        // When
        const result = await service.findOneStation(id);

        // Then
        expect(dataSource.db().collection).toHaveBeenCalledWith('modulos');
        expect(mockCollection.aggregate).toHaveBeenCalledWith(pipeline);
        expect(mockCollection.toArray).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ modulo_id: 1 });
    });

    it('should find daily data', async () => {
        // Given
        const id = 1;
        const params = {
            start: '2025-01-01',
            end: '2025-01-03',
            period: 'daily',
        };
        const data = [
            { modulo_id: 1, data: '2025-01-02' },
            { modulo_id: 1, data: '2025-01-01' },
            { modulo_id: 1, data: '2025-01-03' },
            { modulo_id: 1, data: '2025-01-04' },
            { modulo_id: 2, data: '2025-01-01' },
        ];
        const conditions = {
            modulo_id: id,
            data: { $gte: new Date(params.start), $lte: new Date(params.end) },
        };

        mockCollection.toArray.mockReturnValueOnce(
            mockFindDailyData(id, params, data)
        );
        transformDataByPeriod.mockImplementationOnce((raw) => {
            const items = JSON.parse(JSON.stringify(raw));
            items.forEach((item) => {
                item.time = jest.fn().mockReturnValue(true);
                item.evapotranspiracao = jest.fn().mockReturnValue(true);

            });

            return items;
        });

        // When
        const result = await service.findDailyData(id, params);

        // Then
        expect(dataSource.db().collection).toHaveBeenCalledWith(
            'dadosdiariosestacaos'
        );
        expect(mockCollection.find).toHaveBeenCalledWith(conditions);
        expect(mockCollection.sort).toHaveBeenCalledWith({ data: 1 });
        expect(mockCollection.toArray).toHaveBeenCalledTimes(1);
        expect(transformDataByPeriod).toHaveBeenCalledWith(
            [
                { modulo_id: 1, data: '2025-01-01' },
                { modulo_id: 1, data: '2025-01-02' },
                { modulo_id: 1, data: '2025-01-03' },
            ],
            params.period
        );
        result.forEach(item => {
            expect(item).toHaveProperty('time');
            expect(item).toHaveProperty('evapotranspiracao');
        });
    });
});
