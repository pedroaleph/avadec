const utils = require('../utils/utils');

describe('Utils', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should copy a structure with same value but diffent reference', () => {
        // Given
        const original = [{ modulo_id: 1 }];

        // When
        const copy = utils.copy(original);

        // Then
        expect(original).toEqual(copy);
        expect(original).not.toBe(copy);
    });

    it('should not modify the original structure on change the copy value', () => {
        // Given
        const original = [{ modulo_id: 1 }];

        // When
        const copy = utils.copy(original);
        copy[0].modulo_id = 0;

        // Then
        expect(original[0].modulo_id).toBe(1);
    });

    it('should get the total value by adding the fields in the list', () => {
        // Given
        const items = [{ value: 1 }, { value: 2 }, { value: 3 }];

        // When
        const result = utils.getTotal(items, 'value');

        // Then
        expect(result).toEqual(6);
    });

    it('should get the max value of the field in the list', () => {
        // Given
        const items = [{ value: 14 }, { value: 55 }, { value: 33 }];

        // When
        const result = utils.getMax(items, 'value');

        // Then
        expect(result).toEqual(55);
    });

    it('should get the min value of the field in the list', () => {
        // Given
        const items = [{ value: 14 }, { value: 7 }, { value: 33 }];

        // When
        const result = utils.getMin(items, 'value');

        // Then
        expect(result).toEqual(7);
    });

    it('should calculate the evapotranspiration given the values', () => {
        // Given
        const item = {
            temperaturaArMedia: 24.3,
            umidadeArMedia: 67.5,
            ventoMedia: 9,
            mediaUv: 21.25,
            pressaoArMedia: 1013 
        };

        // When
        const result = utils.getEvapotranspiration(item);

        // Then
        expect(result).toBeCloseTo(4.3, 0.1);
    });
});