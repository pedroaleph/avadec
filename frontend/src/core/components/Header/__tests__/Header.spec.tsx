import { render, screen } from "@testing-library/react";
import Header from "..";

describe('Header Component', () => {
    it('should render', () => {
        // Given
        const item = { name: 'Test' };

        render(
            <Header title={item} />
        );

        // When
        const appName = screen.getByText('avadec');
        const title = screen.getByText(item.name);
        

        // Then
        expect(appName).toBeInTheDocument();
        expect(title).toBeInTheDocument();
    });

    it('should have period displayed', () => {
        // Given
        const item = { name: 'Station', period: 'xx/xx/xxxx a xy/xx/xxxx' };

        render(
            <Header title={item} />
        );

        // When
        const title = screen.getByText(item.name);
        const periodText = screen.getByText('('+ item.period +')');

        // Then
        expect(title).toBeInTheDocument();
        expect(periodText).toBeInTheDocument();
    });
});