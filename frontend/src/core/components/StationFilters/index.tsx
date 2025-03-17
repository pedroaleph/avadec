import { stationVarDict } from 'core/utils/constants';
import { StationVar } from 'core/utils/models';
import { useState } from 'react';
import './styles.scss';

interface Props {
    selectedVar: StationVar;
    setSelectedVar: (value: StationVar) => void;
}

const StationFilters = ({ selectedVar, setSelectedVar }: Props) => {
    const [showFilters, setShowFilters] = useState(true);

    const handleToggleFilters = () => setShowFilters(prev => !prev);

    return (
        <div className="station-filters-container">
            <button
                type="button"
                className="btn btn-expand material-icons"
                onClick={handleToggleFilters}
            >
                {showFilters ? 'keyboard_double_arrow_left' : 'keyboard_double_arrow_right'}
            </button>
            {showFilters && (
                <div className="station-filters-content">
                    <div className="station-vars-container">
                        <h5 className="fw-bold">Variável:</h5>
                        {Object.entries(stationVarDict).map(([key, value], index) => (
                            <div
                                className="form-check"
                                key={key}
                            >
                                <input
                                    id={`station-var-check-${index}`}
                                    className="form-check-input"
                                    type="radio"
                                    value={key}
                                    checked={key === selectedVar}
                                    onChange={() => setSelectedVar(key as StationVar)}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor={`station-var-check-${index}`}
                                >
                                    {value.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StationFilters;