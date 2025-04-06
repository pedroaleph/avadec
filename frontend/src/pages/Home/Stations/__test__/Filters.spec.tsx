import { render, screen } from '@testing-library/react';
import Filters from '../Filters';
import { Station } from 'core/utils/models';
import userEvent from '@testing-library/user-event';

const mockChange = jest.fn();
const mockResponsiveSidebar = jest.fn();
const mockToggle = jest.fn();

jest.mock('core/components/InputField', () => () => (
    <div data-testid="mock-input-filter">Mocked Input</div>
));
jest.mock('core/components/Loading', () => () => (
    <div data-testid="mock-loading">Mocked Loading</div>
));

jest.mock('core/utils/custom-hooks', () => ({
    useResponsiveSidebar: () => mockResponsiveSidebar()
}));

describe('Filters Component', () => {
    beforeAll(() => {
        jest.clearAllMocks();
    });

    it('should render component', () => {
        mockResponsiveSidebar.mockReturnValueOnce({
            isVisible: true,
            isAbsolute: false,
            toggleSidebar: mockToggle,
        });
        // Given
        const items = [{ modulo_id: 1, nome_modulo: 'Test' }] as Station[];
        render(
            <Filters stations={items} isLoading={false} onChange={mockChange} />
        );

        // When
        const container = screen.getByTestId('filters-container');
        const content = screen.queryByTestId('filters-content');
        const inputFilter = screen.queryByTestId('mock-input-filter');
        const displayLoading = screen.queryByTestId('display-loading');
        const emptyText = screen.queryByText('Não há estações disponíveis.');
        const stationButtons = screen.queryAllByTestId('station-button');
        const toggleSidebar = screen.getByTestId('toggle-sidebar');

        // Then
        expect(container).toBeInTheDocument();
        expect(container).toHaveStyle('position: relative');
        expect(content).toBeInTheDocument();
        expect(inputFilter).toBeInTheDocument();
        expect(displayLoading).toHaveClass('d-none');
        expect(emptyText).not.toBeInTheDocument();
        stationButtons.forEach((button, index) => {
            expect(button).toBeInTheDocument();
            expect(button).toHaveTextContent(items[index].nome_modulo);
        });
        expect(toggleSidebar).toBeInTheDocument();
    });

    it('should have position relative', () => {
        mockResponsiveSidebar.mockReturnValueOnce({
            isVisible: true,
            isAbsolute: false,
            toggleSidebar: mockToggle,
        });
        // Given
        const items = [] as Station[];
        render(
            <Filters stations={items} isLoading={false} onChange={mockChange} />
        );

        // When
        const container = screen.getByTestId('filters-container');

        // Then
        expect(container).toBeInTheDocument();
        expect(container).toHaveStyle('position: relative');
    });

    it('should have position absolute', () => {
        mockResponsiveSidebar.mockReturnValueOnce({
            isVisible: true,
            isAbsolute: true,
            toggleSidebar: mockToggle,
        });
        // Given
        const items = [] as Station[];
        render(
            <Filters stations={items} isLoading={false} onChange={mockChange} />
        );

        // When
        const container = screen.getByTestId('filters-container');

        // Then
        expect(container).toBeInTheDocument();
        expect(container).toHaveStyle('position: absolute');
    });

    it('should not have content visible', () => {
        mockResponsiveSidebar.mockReturnValueOnce({
            isVisible: false,
            isAbsolute: false,
            toggleSidebar: mockToggle,
        });
        // Given
        const items = [] as Station[];
        render(
            <Filters stations={items} isLoading={false} onChange={mockChange} />
        );

        // When
        const container = screen.getByTestId('filters-container');
        const content = screen.queryByTestId('filters-content');
        const toggleSidebar = screen.getByTestId('toggle-sidebar');

        // Then
        expect(container).toBeInTheDocument();
        expect(content).not.toBeInTheDocument();
        expect(toggleSidebar).toBeInTheDocument();
    });

    it('should display loading', () => {
        mockResponsiveSidebar.mockReturnValueOnce({
            isVisible: true,
            isAbsolute: false,
            toggleSidebar: mockToggle,
        });
        // Given
        const items = [] as Station[];
        render(
            <Filters stations={items} isLoading={true} onChange={mockChange} />
        );

        // When
        const displayLoading = screen.queryByTestId('display-loading');
        const loading = screen.queryByTestId('mock-loading');

        // Then
        expect(displayLoading).not.toHaveClass('d-none');
        expect(loading).toBeInTheDocument();
    });

    it('should display empty text', () => {
        mockResponsiveSidebar.mockReturnValueOnce({
            isVisible: true,
            isAbsolute: false,
            toggleSidebar: mockToggle,
        });
        // Given
        const items = [] as Station[];
        render(
            <Filters stations={items} isLoading={false} onChange={mockChange} />
        );

        // When
        const emptyText = screen.queryByText('Não há estações disponíveis.');
        const stationButtons = screen.queryAllByTestId('station-button');

        // Then
        expect(emptyText).toBeInTheDocument();
        stationButtons.forEach(button => {
            expect(button).not.toBeInTheDocument();
        });
    });

    it('should call onChange on click in station button', () => {
        mockResponsiveSidebar.mockReturnValueOnce({
            isVisible: true,
            isAbsolute: false,
            toggleSidebar: mockToggle,
        });
        // Given
        const items = [{ modulo_id: 1, nome_modulo: 'Test' }] as Station[];
        render(
            <Filters stations={items} isLoading={false} onChange={mockChange} />
        );

        // When
        const stationButtons = screen.queryAllByTestId('station-button');
        stationButtons.forEach((button, index) => {
            userEvent.click(button);

            // Then
            expect(mockChange).toHaveBeenCalledWith(items[index]);
        });
    });

    it('should should call toggleSidebar', () => {
        mockResponsiveSidebar.mockReturnValueOnce({
            isVisible: true,
            isAbsolute: false,
            toggleSidebar: mockToggle,
        });
        // Given
        const items = [] as Station[];
        render(
            <Filters stations={items} isLoading={false} onChange={mockChange} />
        );

        // When
        const toggleSidebar = screen.getByTestId('toggle-sidebar');
        userEvent.click(toggleSidebar);

        // Then
        expect(toggleSidebar).toBeInTheDocument();
        expect(mockToggle).toHaveBeenCalled();
    });
});
