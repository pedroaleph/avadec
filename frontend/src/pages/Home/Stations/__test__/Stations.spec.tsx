import { act, render, screen, waitFor } from '@testing-library/react';
import Stations from '..';

const mockSetStationId = jest.fn();
const mockSetHeaderTitle = jest.fn();
const mockGet = jest.fn();
const mockNavigate = jest.fn();
jest.mock('core/utils/request', () => ({
    get: async (url: string) => mockGet(url),
}));

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock('../Filters', () => () => (
    <div data-testid="mock-filters">Mocked Filters</div>
));

jest.mock('core/utils/mapbox-gl');

describe('Stations Component', () => {
    const spyStorage = jest.spyOn(Storage.prototype, 'removeItem');

    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it('should render component', async () => {
        // Given
        mockGet.mockResolvedValueOnce({ data: [{ modulo_id: 1 }] });
        // eslint-disable-next-line testing-library/no-unnecessary-act
        await act(async () => { 
            render(
                <Stations
                    setStationId={mockSetStationId}
                    setHeaderTitle={mockSetHeaderTitle}
                />
            )
        });

        // When
        const filters = screen.getByTestId('mock-filters');
        const mapContainer = screen.getByTestId('map-container');
        const mapCoorninates = screen.getByTestId('map-coordinates');
        const mapStreetsButton = screen.getByTestId('map-streets-button');
        const mapDarkButton = screen.getByTestId('map-dark-button');
        const mapSatelliteButton = screen.getByTestId('map-satellite-button');

        // Then
        expect(spyStorage).toHaveBeenCalled();
        expect(filters).toBeInTheDocument();
        expect(mapContainer).toBeInTheDocument();
        expect(mapCoorninates).toBeInTheDocument();
        expect(mapStreetsButton).toBeInTheDocument();
        expect(mapDarkButton).toBeInTheDocument();
        expect(mapSatelliteButton).toBeInTheDocument();
        await waitFor(() => {
            expect(mockGet).toHaveBeenCalledWith('/stations');
        });
    });
});
