import { render, screen } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { DailyData } from 'core/utils/models';
import { stationVariables } from 'core/utils/constants';

jest.mock('core/components/Chart', () => (props: { stationVar: string, period: string, interval: number[], data: DailyData[] }) => (
    <div data-testid="mock-chart">{ JSON.stringify(props) }</div>
));

describe('Dasboard Component', () => {
    it('should render charts', () => {
        // Given
        const period = 'daily';
        const interval: number[] = [0];
        const items = [{ modulo_id: 0 }] as DailyData[];
        render(<Dashboard period={period} interval={interval} data={items} />);

        // When
        const charts = screen.getAllByTestId('mock-chart');

        // Then
        expect(charts.length).toEqual(stationVariables.length);
        charts.forEach((chart, index) => {
            expect(chart).toBeInTheDocument();
            expect(chart).toHaveTextContent(`"stationVar":"${stationVariables[index]}"`);
            expect(chart).toHaveTextContent(`"period":"${period}"`);
            expect(chart).toHaveTextContent(`"interval":${JSON.stringify(interval)}`);
            expect(chart).toHaveTextContent(`"data":${JSON.stringify(items)}`);
        });
    });
});
