import { render, screen } from '@testing-library/react';
import GoBack from '..';
import { useNavigate } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

jest.mock('react-router-dom');

describe('Loading Component', () => {
    it('should render', () => {
        // Given
        render(<GoBack path='' />);

        // When
        const text = screen.getByText('Voltar');
        const button = screen.getByTestId('go-back-button');

        // Then
        expect(text).toBeInTheDocument();
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('keyboard_arrow_left');
        expect(button).toHaveClass('material-icons');
    });

    it('should navigate on click button', () => {
        // Given
        const mockNavigate = jest.fn();
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        const path = '/test';
        render(<GoBack path={path} />);

        // When
        const button = screen.getByTestId('go-back-button');
        userEvent.click(button);

        // Then
        expect(button).toBeInTheDocument();
        expect(mockNavigate).toHaveBeenCalledWith(path);
    });
});
