import { render, screen } from "@testing-library/react";
import Loading from "..";

describe('Loading Component', () => {
    it('should render', () => {
        // Given
        render(
            <Loading />
        );

        // When
        const spinner = screen.getByTestId('spinner');
        const text = screen.getByText('Loading...');

        // Then
        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveClass('spinner-border');
        expect(spinner).toHaveAttribute('role', 'status');
        expect(text).toBeInTheDocument();
    });
});