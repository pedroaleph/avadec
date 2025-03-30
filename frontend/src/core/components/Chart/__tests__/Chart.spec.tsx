import { render, screen } from '@testing-library/react';
import Chart from '..';
import { DailyData } from 'core/utils/models';
import { stationVarDict } from 'core/utils/constants';

describe('Chart Component', () => {
    it.skip('should render chart', () => {
        // Given
        const stationVar = 'precipitation';
        const period = 'daily';
        const interval: number[] = [];
        const items: DailyData[] = [];

        // When
        render(
            <Chart
                stationVar={stationVar}
                period={period}
                interval={interval}
                data={items}
            />
        );
        const label = screen.getByText(stationVarDict[stationVar].label);

        // Then
        expect(label).toBeInTheDocument();
    });
});
