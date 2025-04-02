import { render, screen } from '@testing-library/react';
import Chart, { formatter, getMax, labelFormatter, tickFormatter } from '..';
import { DailyData } from 'core/utils/models';
import { stationVarDict } from 'core/utils/constants';

describe('Chart Component', () => {
    beforeAll(() => {
        global.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        };
    });

    it('should render chart', async () => {
        // Given
        const stationVar = 'precipitation';
        const period = 'daily';
        const interval: number[] = [];
        const items: DailyData[] = [];
        render(
            <div style={{ width: 500, height: 300 }}>
                <Chart
                    stationVar={stationVar}
                    period={period}
                    interval={interval}
                    data={items}
                />
            </div>
        );

        setTimeout(() => {
            // When
            const label = screen.getByText(stationVarDict[stationVar].label);
            const unit = screen.getByText(stationVarDict[stationVar].unit);
            const chart = screen.getByTestId('chart-' + stationVar);

            // Then
            expect(label).toBeInTheDocument();
            expect(unit).toBeInTheDocument();
            expect(chart).toBeInTheDocument();
            expect(chart).toHaveAttribute('data', items);
        });
    });

    it('should format tick by daily period', () => {
        // Giver
        const period = 'daily';
        const date = new Date('2025/01/02');
        const time = date.getTime();

        // When
        const periodFormatter = tickFormatter(period);
        const result = periodFormatter(time);

        // Then
        expect(result).toEqual('2/01')
    });

    it('should format tick by monthly period', () => {
        // Giver
        const period = 'monthly';
        const date = new Date('2025/01/02');
        const time = date.getTime();


        // When
        const periodFormatter = tickFormatter(period);
        const result = periodFormatter(time);

        // Then
        expect(result).toEqual('JAN/2025');
    });

    it('should format label by daily period', () => {
        // Giver
        const period = 'daily';
        const date = new Date('2025/01/02');
        const time = date.getTime();

        // When
        const periodFormatter = labelFormatter(period);
        const result = periodFormatter(time);

        // Then
        expect(result).toEqual(date.toLocaleDateString());
    });

    it('should format label by daily monthly', () => {
        // Giver
        const period = 'monthly';
        const date = new Date('2025/01/02');
        const time = date.getTime();

        // When
        const periodFormatter = labelFormatter(period);
        const result = periodFormatter(time);

        // Then
        expect(result).toEqual('Janeiro de 2025');
    });

    it('should render tooltip with value and unit', () => {
        // Giver
        const unit = 'test';
        const value = 25;
        const unitFormatter = formatter(unit);
        render(unitFormatter(value));

        // When
        const result = screen.getByTestId('tooltip-value');

        // Then
        expect(result).toBeInTheDocument();
        expect(result).toHaveTextContent('25.00test');
    });

    it('should get default limit when there is no value greater than the default', () => {
        // Given
        const stationVar = 'precipitation';
        const items = [{ precipitacao: 350 }, { precipitacao: 200 }] as DailyData[];
        const defaultLimit = 400;

        // When
        const result = getMax(stationVar, items, defaultLimit);

        // Then
        expect(result).toEqual(defaultLimit);
    });

    it('should get the value greater rounded when the default is not the greater', () => {
        // Given
        const stationVar = 'precipitation';
        const items = [{ precipitacao: 350 }, { precipitacao: 450 }] as DailyData[];
        const defaultLimit = 400;

        // When
        const result = getMax(stationVar, items, defaultLimit);

        // Then
        expect(result).toEqual(500);
    });
});