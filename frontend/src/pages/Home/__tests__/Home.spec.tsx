import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '..';

const mockNavigate = jest.fn();
const mockLocation = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation(),
}));

jest.mock('core/components/Header', () => () => (
    <div data-testid="mock-header">Mocked Header</div>
));
jest.mock('../Stations', () => () => (
    <div data-testid="mock-stations">Mocked Stations</div>
));
jest.mock('../Station', () => () => (
    <div data-testid="mock-station">Mocked Station</div>
));

describe('Home Component', () => {
    beforeEach(() => {
        jest.spyOn(Storage.prototype, 'getItem').mockClear();
        mockNavigate.mockClear();
        mockLocation.mockClear();
    });

    it('should render Stations page when at /stations', () => {
        // Given
        mockLocation.mockReturnValueOnce({ pathname: '/stations' });
        render(
            <MemoryRouter initialEntries={['/stations']}>
                <Home />
            </MemoryRouter>
        );

        // When
        const header = screen.getByTestId('mock-header');
        const stations = screen.getByTestId('mock-stations');
        const station = screen.queryByTestId('mock-station');

        // Then
        expect(header).toBeInTheDocument();
        expect(stations).toBeInTheDocument();
        expect(station).not.toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should render with StationSelected page when at /stations/:id', () => {
        // Given
        mockLocation.mockReturnValueOnce({ pathname: '/stations/123' });
        render(
            <MemoryRouter initialEntries={['/stations/123']}>
                <Home />
            </MemoryRouter>
        );

        // When
        const header = screen.getByTestId('mock-header');
        const stations = screen.queryByTestId('mock-stations');
        const station = screen.getByTestId('mock-station');

        // Then
        expect(header).toBeInTheDocument();
        expect(stations).not.toBeInTheDocument();
        expect(station).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should redirect to Stations page when at / and there is no stationId', () => {
        // Given
        mockLocation.mockReturnValueOnce({ pathname: '/' });
        jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
        render(
            <MemoryRouter initialEntries={['/']}>
                <Home />
            </MemoryRouter>
        );

        // When
        const stations = screen.queryByTestId('mock-stations');

        // Then
        expect(mockNavigate).toHaveBeenCalledWith('/stations');
        setTimeout(() => {
            expect(stations).toBeInTheDocument();
        });
    });

    it('should redirect to Station page when at / and there is stationId', () => {
        // Given
        mockLocation.mockReturnValueOnce({ pathname: '/' });
        jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('123');
        render(
            <MemoryRouter initialEntries={['/']}>
                <Home />
            </MemoryRouter>
        );

        // When
        const station = screen.queryByTestId('mock-station');

        // Then
        expect(mockNavigate).toHaveBeenCalledWith('/stations/123');
        setTimeout(() => {
            expect(station).toBeInTheDocument();
        });
    });
});
