import { useNavigate } from "react-router-dom";

interface Props {
    path: string;
    text?: string;
}

const GoBack = ({ path, text }: Props) => {
    const label = text || 'Voltar';
    const navigate = useNavigate();

    return (
        <div className="d-flex align-items-center">
            <button
                type="button"
                className="btn btn-secondary material-icons"
                onClick={() => navigate(path)}
                data-testid="go-back-button"
            >
                keyboard_arrow_left
            </button>
            <span className="text-secondary px-2 fw-bold">
                { label }
            </span>
        </div>
    );
};

export default GoBack;
