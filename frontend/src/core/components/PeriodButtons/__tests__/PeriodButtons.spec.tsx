import { render, screen } from '@testing-library/react';
import PeriodButtons from '..';
import { Period } from 'core/utils/models';
import userEvent from '@testing-library/user-event';

describe('Period Buttons Component', () => {
    it('should render', () => {
        // Given
        const items = ['7 dias', '15 dias', 'Mês', 'Ano'];
        let period: Period = 0;
        const setPeriod = (value: Period) => {
            period = value;
        };
        render(<PeriodButtons period={period} setPeriod={setPeriod} />);

        // When
        const fieldLabel = screen.getByText('Último(s):');
        const buttons = items.map((item, index) => screen.getByTestId('periodButton' + index));

        // Then
        expect(fieldLabel).toBeInTheDocument();
        buttons.forEach((button, index) => {
            const hasClass = index === period ? 'btn-primary' : 'btn-outline-primary';
            const hasNoClass = index === period ? 'btn-outline-primary' : 'btn-primary';

            expect(button).toHaveTextContent(items[index]);
            expect(button).toHaveClass(hasClass);
            expect(button).not.toHaveClass(hasNoClass);
        });
    });

    it('should change period on click', () => {
        // Given
        const items = ['7 dias', '15 dias', 'Mês', 'Ano'];
        let period: Period = 0;
        const setPeriod = (value: Period) => {
            period = value;
        };
        render(<PeriodButtons period={period} setPeriod={setPeriod} />);

        items.forEach((item, index) => {
            // When
            const button = screen.getByTestId('periodButton' + index);
            userEvent.click(button);

            // Then
            expect(button).toBeInTheDocument();
            expect(button).toHaveTextContent(item);
            expect(period).toEqual(index);
            setTimeout(() => {
                expect(button).toHaveClass('btn-primary');
                expect(button).not.toHaveClass('btn-outline-primary');
            });
        });
    });
});
