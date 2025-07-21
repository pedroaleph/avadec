import { render, screen, waitFor } from '@testing-library/react';
import StationSelected, { getStartByPeriod } from '..';

const mockGet = jest.fn();

jest.mock('core/utils/request', () => ({
    get: async (url: string) => mockGet(url),
}));

jest.mock('react-router-dom', () => ({
    useParams: () => ({ id: '1' }),
}));

jest.mock('core/components/GoBack', () => () => (
    <div data-testid="mock-go-back">Mocked Go Back</div>
));
jest.mock('core/components/PeriodButtons', () => () => (
    <div data-testid="mock-period-buttons">Mocked Period Buttons</div>
));
jest.mock('core/components/Loading', () => () => (
    <div data-testid="mock-loading">Mocked Loading</div>
));
jest.mock('../Dashboard', () => () => (
    <div data-testid="mock-dashboard">Mocked Dashboard</div>
));

describe('Station Component', () => {
    let stationId = '';
    const setStationId = (id: string) => {
        stationId = id;
    };
    const setHeaderTitle = (value: { name: string; period?: string }) =>
        jest.fn();
    const spyStorage = jest.spyOn(Storage.prototype, 'setItem');

    beforeEach(() => {
        spyStorage.mockClear();
    });

    it('should render component', async () => {
        // Given
        stationId = '1';
        mockGet.mockResolvedValueOnce({
            data: { modulo_id: 1, inicio: '2025/01/01', termino: '2025/01/31' },
        });
        mockGet.mockResolvedValueOnce({ data: [{ modulo_id: 1 }] });
        render(
            <StationSelected
                stationId={stationId}
                setStationId={setStationId}
                setHeaderTitle={setHeaderTitle}
            />
        );

        // When
        const goBack = screen.getByTestId('mock-go-back');
        const periodButtons = screen.getByTestId('mock-period-buttons');
        const loading = screen.getByTestId('mock-loading');
        const displayLoading = screen.getByTestId('display-loading');
        const displayDashboard = screen.getByTestId('display-dashboard');
        const emptyMessage = screen.getByText('Não há dados disponíveis.');

        // Then
        expect(spyStorage).toHaveBeenCalled();
        expect(goBack).toBeInTheDocument();
        expect(periodButtons).toBeInTheDocument();
        expect(loading).toBeInTheDocument();
        expect(displayLoading).not.toHaveClass('d-none');
        expect(displayDashboard).toHaveClass('d-none');
        await waitFor(() => {
            expect(mockGet).toHaveBeenCalledWith('/stations/1');
        });
        await waitFor(() => {
            expect(mockGet).toHaveBeenCalledWith('/daily-data/1');
        }).then(() => {
            const dashboard = screen.queryByTestId('mock-dashboard');

            expect(dashboard).toBeInTheDocument();
        });
        expect(displayLoading).toHaveClass('d-none');
        expect(displayDashboard).not.toHaveClass('d-none');
        expect(emptyMessage).not.toBeInTheDocument();
    });

    it('should render with empty message', async () => {
        // Given
        stationId = '1';
        mockGet.mockResolvedValueOnce({
            data: { modulo_id: 1, inicio: '2025/01/01', termino: '2025/01/31' },
        });
        mockGet.mockResolvedValueOnce({ data: [] });
        render(
            <StationSelected
                stationId={stationId}
                setStationId={setStationId}
                setHeaderTitle={setHeaderTitle}
            />
        );

        // When
        const displayDashboard = screen.getByTestId('display-dashboard');
        const emptyMessage = screen.getByText('Não há dados disponíveis.');

        // Then
        await waitFor(() => {
            expect(mockGet).toHaveBeenCalledTimes(2);
        }).then(() => {
            const dashboard = screen.queryByTestId('mock-dashboard');

            expect(dashboard).not.toBeInTheDocument();
        });
        expect(displayDashboard).not.toHaveClass('d-none');
        expect(emptyMessage).toBeInTheDocument();
    });

    it('should get the first day of 7 day period', () => {
        // Given
        const period = 0; // 7 days
        const date = '2025-01-30T04:00:00.000Z';

        // When
        const result = getStartByPeriod(period, date);
        const expectedResult = new Date('2025-01-24T04:00:00.000Z');

        // Then
        expect(result).toEqual(expectedResult);
    });

    it('should get the first day of 15 day period', () => {
        // Given
        const period = 1; // 15 days
        const date = '2025-01-30T04:00:00.000Z';

        // When
        const result = getStartByPeriod(period, date);
        const expectedResult = new Date('2025-01-16T04:00:00.000Z');

        // Then
        expect(result).toEqual(expectedResult);
    });

    it('should get the first day of month period', () => {
        // Given
        const period = 2; // month
        const date = '2025-01-30T04:00:00.000Z';

        // When
        const result = getStartByPeriod(period, date);
        const expectedResult = new Date('2024-12-31T04:00:00.000Z');

        // Then
        expect(result).toEqual(expectedResult);
    });

    it('should get the first day of year period', () => {
        // Given
        const period = 3; // year
        const date = '2025-01-30T04:00:00.000Z';

        // When
        const result = getStartByPeriod(period, date);
        const expectedResult = new Date('2024-01-31T04:00:00.000Z');

        // Then
        expect(result).toEqual(expectedResult);
    });

    it('should get the same date when there is no period defined', () => {
        // Given
        const period = -1; // no defined
        const date = '2025-01-30T04:00:00.000Z';

        // When
        const result = getStartByPeriod(period, date);
        const expectedResult = new Date(date);

        // Then
        expect(result).toEqual(expectedResult);
    });
});
