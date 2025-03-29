const { transformByDaily, transformByMonthly } = require("../utils/period");
const { getEvapotranspiration, getTotal, getMax, getMin } = require("../utils/utils");

jest.mock('../utils/utils');

describe('Period', () => {

    getEvapotranspiration.mockReturnValue(true);
    getTotal.mockReturnValue(true);
    getMax.mockReturnValue(true);
    getMin.mockReturnValue(true);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should transform by daily', () => {
        // Given
        const items = [
            { modulo_id: 1, data: '2025-01-01', precipitacao: 14, med: 67, max: 89, min: 31 },
            { modulo_id: 1, data: '2025-01-02', precipitacao: 15, med: 69, max: 97, min: 45 },
            { modulo_id: 1, data: '2025-01-03', precipitacao: 55, med: 34, max: 64, min: 12 },
            { modulo_id: 1, data: '2025-01-04', precipitacao: 45, med: 45, max: 67, min: 9 },
        ];

        // When
        const result = transformByDaily(items);

        // Then
        expect(getEvapotranspiration).toHaveBeenCalledTimes(items.length);
        expect(result.length).toEqual(items.length);
        result.forEach(item => {
            expect(item).toHaveProperty('time');
            expect(item).toHaveProperty('evapotranspiracao');
        });
    });

    it('should transform by monthly', () => {
        // Given
        const items = [
            { modulo_id: 1, data: '2025-01-01', precipitacao: 56, med: 67, max: 89, min: 31 },
            { modulo_id: 1, data: '2025-01-02', precipitacao: 54, med: 69, max: 97, min: 45 },
            { modulo_id: 1, data: '2025-01-03', precipitacao: 45, med: 34, max: 64, min: 12 },
            { modulo_id: 1, data: '2025-01-04', precipitacao: 78, med: 45, max: 67, min: 9 },
            { modulo_id: 1, data: '2025-02-01', precipitacao: 34, med: 58, max: 91, min: 21 },
            { modulo_id: 1, data: '2025-02-02', precipitacao: 89, med: 63, max: 88, min: 19 },
            { modulo_id: 1, data: '2025-02-03', precipitacao: 23, med: 42, max: 77, min: 29 },
            { modulo_id: 1, data: '2025-03-01', precipitacao: 34, med: 51, max: 102, min: 39 },
        ];
        const countMonths = new Set(
            items.map(({ data }) => data.slice(0, 7))
        ).size;

        // When
        const result = transformByMonthly(items);

        // Then
        expect(getEvapotranspiration).toHaveBeenCalledTimes(items.length);
        expect(getTotal).toHaveBeenCalledTimes(countMonths * 3);
        expect(getMax).toHaveBeenCalledTimes(countMonths);
        expect(getMin).toHaveBeenCalledTimes(countMonths);
        expect(result.length).toEqual(countMonths);
        result.forEach(item => {
            expect(item).toHaveProperty('time');
            expect(item).toHaveProperty('evapotranspiracao');
        });
    });
});