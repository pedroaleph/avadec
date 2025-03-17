import { Period } from "core/utils/models";

const periods = ['7 dias', '15 dias', 'Mês', 'Ano'];

interface Props {
    period: Period;
    setPeriod: (value: Period) => void;
}

const PeriodButtons = ({ period, setPeriod }: Props) => {
    return (
        <div className="d-flex align-items-center">
            <p className="mb-0">Último(s): </p>
            {
                periods.map((value, index) => (
                    <button
                        type="button"
                        key={index}
                        className={`btn ${index === period ? 'btn-primary' : 'btn-outline-primary'} ms-2 text-nowrap`}
                        onClick={(e) => setPeriod(index as Period)}
                    >
                        {value}
                    </button>
                ))
            }
        </div>
    );
};

export default PeriodButtons;
