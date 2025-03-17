import { useNavigate } from "react-router-dom";

interface Props {
    path: string;
}

const GoBack = ({ path }: Props) => {
    const navigate = useNavigate();

    return (
        <div className="d-flex align-items-center">
            <button
                type="button"
                className="btn btn-secondary material-icons"
                onClick={() => navigate(path)}
            >
                keyboard_arrow_left
            </button>
            <span className="text-secondary px-2 fw-bold">
                Selecionar outra
            </span>
        </div>
    );
};

export default GoBack;
