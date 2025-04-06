import { render, screen } from '@testing-library/react';
import InputField from '..';
import userEvent from '@testing-library/user-event';

describe('Input Field Component', () => {
    it('should render component', () => {
        // Given
        const id = 'test-id';
        const label = 'Test label';
        const placeholder = 'Test placehoder';
        let item = 'Test';
        const setValue = (value: string) => {
            item = value;
        };
        render(
            <InputField
                id={id}
                label={label}
                placeholder={placeholder}
                value={item}
                setValue={setValue}
            />
        );

        // When
        const labelText = screen.getByLabelText(label);
        const input = screen.getByTestId(id);

        // Then
        expect(labelText).toBeInTheDocument();
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('type', 'text');
        expect(input).toHaveValue(item);
        expect(input).toHaveAttribute('placeholder', placeholder);
    });

    it('should change value', () => {
        // Given
        const id = 'test-id';
        const label = 'Test label';
        const placeholder = 'Test placehoder';
        let item = 'Test';
        const setValue = (value: string) => {
            item = value;
        };

        render(
            <InputField
                id={id}
                label={label}
                placeholder={placeholder}
                value={item}
                setValue={setValue}
            />
        );

        // When
        const input = screen.getByTestId(id);
        userEvent.type(input, 'e');

        // Then
        expect(item).toEqual('Teste');
    });
});
