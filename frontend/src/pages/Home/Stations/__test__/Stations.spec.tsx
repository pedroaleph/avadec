import Stations from '..';

const mockSetStationId = jest.fn();
const mockSetHeaderTitle = jest.fn();
const mockGet = jest.fn();
jest.mock('core/utils/request', () => ({
    get: async (url: string) => mockGet(url),
}));

jest.mock('core/utils/mapbox-gl');

describe('Stations Component', () => {
    it.skip('should render component', () => {
        // Given
        mockGet.mockResolvedValueOnce([]);
        <Stations
            setStationId={mockSetStationId}
            setHeaderTitle={mockSetHeaderTitle}
        />;
    });
});
