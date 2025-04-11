import { act, render, screen, waitFor } from '@testing-library/react';
import Stations from '..';
import userEvent from '@testing-library/user-event';
import { Station } from 'core/utils/models';

const mockSetStationId = jest.fn();
const mockSetHeaderTitle = jest.fn();
const mockGet = jest.fn();
const mockNavigate = jest.fn();
const mockChangeMapStyle = jest.fn();
const mockflyToStation = jest.fn();

interface mockFilterI {
    stations: Station[];
    onChange: (station: Station) => void;
}

jest.mock('core/utils/request', () => ({
    get: async (url: string) => mockGet(url),
}));

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock('../Filters', () => ({ stations, onChange }: mockFilterI) => (
    <button data-testid="mock-filters" onClick={() => onChange(stations[0])}>Mocked Filters</button>
));

jest.mock('core/utils/mapbox-gl', () => ({
    createMap: jest.fn(),
    createMarkers: jest.fn(),
    changeStyle: (value: string) => mockChangeMapStyle(value),
    flyToStation: (station: Station) => mockflyToStation(station)
}));

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

    it('should change map style to streets mode', async () => {
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
        const mapStreetsButton = screen.getByTestId('map-streets-button');
        userEvent.click(mapStreetsButton);

        // Then
        expect(mapStreetsButton).toBeInTheDocument();
        await waitFor(() => {
            expect(mockGet).toHaveBeenCalledWith('/stations');
        });
        expect(mockChangeMapStyle).toHaveBeenCalledWith('streets');
    });

    it('should change map style to dark mode', async () => {
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
        const mapDarkButton = screen.getByTestId('map-dark-button');
        userEvent.click(mapDarkButton);

        // Then
        expect(mapDarkButton).toBeInTheDocument();
        await waitFor(() => {
            expect(mockGet).toHaveBeenCalledWith('/stations');
        });
        expect(mockChangeMapStyle).toHaveBeenCalledWith('dark');
    });

    it('should change map style to satellite mode', async () => {
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
        const mapSatelliteButton = screen.getByTestId('map-satellite-button');
        userEvent.click(mapSatelliteButton);

        // Then
        expect(mapSatelliteButton).toBeInTheDocument();
        await waitFor(() => {
            expect(mockGet).toHaveBeenCalledWith('/stations');
        });
        expect(mockChangeMapStyle).toHaveBeenCalledWith('satellite');
    });

    it('should fly to station', async () => {
        // Given
        const items = [{ modulo_id: 1 }];
        mockGet.mockResolvedValueOnce({ data: items });
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
        userEvent.click(filters);

        // Then
        expect(filters).toBeInTheDocument();
        await waitFor(() => {
            expect(mockGet).toHaveBeenCalledWith('/stations');
        });
        expect(mockflyToStation).toHaveBeenCalledWith(items[0]);
    });
});
