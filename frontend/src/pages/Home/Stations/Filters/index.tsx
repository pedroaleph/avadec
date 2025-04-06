import { Station } from 'core/utils/models';
import { useMemo, useState } from 'react';
import './styles.scss';
import Loading from 'core/components/Loading';
import { useResponsiveSidebar } from 'core/utils/custom-hooks';
import InputField from 'core/components/InputField';

interface Props {
    stations: Station[];
    onChange: (station: Station) => void;
    isLoading: boolean;
}

const Filters = ({ stations, onChange, isLoading }: Props) => {
    const [searchStation, setSearchStation] = useState('');
    const { isVisible, isAbsolute, toggleSidebar } = useResponsiveSidebar();

    const filteredStations = useMemo(() => {
        return stations.filter((station) =>
            station.nome_modulo
                .toLowerCase()
                .includes(searchStation.toLowerCase())
        );
    }, [stations, searchStation]);

    return (
        <div
            style={{
                marginLeft: isAbsolute ? 30 : 0,
            }}
        >
            <div
                className="d-flex filters-container"
                style={{
                    width: isVisible ? 350 : 30,
                    position: isAbsolute ? 'absolute' : 'relative',
                }}
                data-testid="filters-container"
            >
                {isVisible && (
                    <div className="px-3 py-3 filters-content" data-testid="filters-content">
                        <div className="mb-3 border border-primary pt-3 px-2">
                            <InputField
                                id='station-filter'
                                label='Estação:'
                                placeholder='Nome da estação'
                                value={searchStation}
                                setValue={setSearchStation}
                            />
                            <div className="filter-stations">
                                <div className={isLoading ? 'd-block position-relative' : 'd-none'} data-testid="display-loading">
                                    <Loading />
                                </div>
                                { 
                                    !isLoading && !filteredStations.length && (
                                        <p className='text-start ps-2 ms-1'>Não há estações disponíveis.</p>
                                    )
                                }
                                {filteredStations.map((station) => (
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary btn-filter mx-0"
                                            key={station.modulo_id}
                                            onClick={() => onChange(station)}
                                            data-testid="station-button"
                                        >
                                            <span>{station.nome_modulo}</span>
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}
            <button
                type="button"
                className="btn btn-expand material-icons"
                onClick={toggleSidebar}
                data-testid="toggle-sidebar"
            >
                keyboard_double_arrow_right
            </button>
            </div>
        </div>
    );
};

export default Filters;
