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
});