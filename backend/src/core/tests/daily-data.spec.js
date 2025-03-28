const { transformDataByPeriod } = require('../utils/daily-data');
const { transformByDaily, transformByMonthly } = require('../utils/period');
const { copy } = require('../utils/utils');

jest.mock('../utils/utils');
jest.mock('../utils/period');

describe('Daily Data', () => {
    copy.mockImplementation((_) => JSON.parse(JSON.stringify(_)));

    const mockTransform = (_) => {
        const data = copy(_);
        data.map((item) => {
            item.time = jest.fn().mockReturnThis();
            item.evapotranspiracao = jest.fn().mockReturnThis();
        });

        return data;
    };

    transformByDaily.mockImplementation(mockTransform);
    transformByMonthly.mockImplementation((_) => {
        const items = mockTransform(_);
        const obj = {};
        items.forEach((item) => {
            const key = item.data.slice(0, 7);

            if (!obj.hasOwnProperty(key)) {
                obj[key] = item;
            }
        });

        const result = Object.keys(obj).map((key) => obj[key]);

        return result;
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should transform daily data by daily period', () => {
        // Given
        const items = [{ modulo_id: 1 }];
        const period = 'daily';

        // When
        const result = transformDataByPeriod(items, period);

        // Then
        expect(copy).toHaveBeenCalledWith(items);
        expect(transformByDaily).toHaveBeenCalledWith(items);
        expect(transformByMonthly).not.toHaveBeenCalled();
        expect(result.length).toEqual(items.length);
        result.forEach((item) => {
            expect(item).toHaveProperty('time');
            expect(item).toHaveProperty('evapotranspiracao');
        });
    });

    it('should transform daily data by monthly period', () => {
        // Given
        const items = [
            { modulo_id: 1, data: '2025-01-01' },
            { modulo_id: 1, data: '2025-01-02' },
            { modulo_id: 1, data: '2025-02-01' },
            { modulo_id: 1, data: '2025-02-02' },
        ];
        const period = 'monthly';
        const countMonths = new Set(
            items.map(({ data }) => data.slice(0, 7))
        ).size;

        // When
        const result = transformDataByPeriod(items, period);

        // Then
        expect(copy).toHaveBeenCalledWith(items);
        expect(transformByMonthly).toHaveBeenCalledWith(items);
        expect(transformByDaily).not.toHaveBeenCalled();
        expect(result.length).toEqual(countMonths);
        result.forEach((item) => {
            expect(item).toHaveProperty('time');
            expect(item).toHaveProperty('evapotranspiracao');
        });
    });
});
