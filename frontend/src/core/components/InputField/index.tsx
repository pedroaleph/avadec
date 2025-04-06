interface Props {
    id: string;
    label: string;
    placeholder: string;
    value: string;
    setValue: (value: string) => void;
}

const InputField = ({ id, label, placeholder, value, setValue }: Props) => {
    return (
        <div className="mb-3 text-start px-3">
            <label htmlFor={id} className="form-label">
                {label}
            </label>
            <input
                id={id}
                data-testid={id}
                type="text"
                className="form-control"
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    );
};

export default InputField;
