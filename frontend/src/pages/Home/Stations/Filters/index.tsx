import { Station, StationType } from 'core/utils/models';
import { useEffect, useState } from 'react';
import { states } from 'pages/Home/Stations/utils';
import mapboxgl from 'mapbox-gl';
import './styles.scss';
import Loading from 'core/components/Loading';

interface Props {
    stations: Station[];
    map: mapboxgl.Map | null;
    markers: mapboxgl.Marker[];
    isLoading: boolean;
}

const Filters = ({ stations, map, markers, isLoading }: Props) => {
    const [searchStation, setSearchStation] = useState('');
    const [searchState, setSearchState] = useState('');
    const [selectedType, setSelectedType] = useState<StationType>(1);
    const [showFilters, setShowFilters] = useState(false);
    const [filterAbsolute, setfilterAbsolute] = useState(false);

    const handleResize = () => {
        setShowFilters(window.innerWidth > 1200);
        setfilterAbsolute(window.innerWidth <= 1200);
    };

    useEffect(() => {
        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        markers.forEach((marker) => {
            const el = marker.getElement();
            const isTypeSelected = el.classList.contains(
                `marker-${selectedType}`
            );

            if (!isTypeSelected) {
                el.classList.add('d-none');
            } else {
                el.classList.remove('d-none');
            }
        });
    }, [markers, selectedType]);

    const onChangeCoordinates = (lng: number, lat: number) => {
        map &&
            map.flyTo({
                center: [lng, lat],
                essential: true,
                zoom: 8.15,
            });
    };

    return (
        <div
            style={{
                marginLeft: filterAbsolute ? 30 : 0,
            }}
        >
            <div
                className="d-flex filters-container"
                style={{
                    width: showFilters ? 350 : 30,
                    position: filterAbsolute ? 'absolute' : 'relative',
                }}
            >
                {showFilters && (
                    <div className="px-3 py-3 filters-content">
                        <div className="mb-3 d-none">
                            <h5>Tipo</h5>
                            <div className="border border-primary">
                                <button
                                    type="button"
                                    onClick={() => setSelectedType(1)}
                                    className="btn btn-station btn-online"
                                >
                                    On-line
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedType(0)}
                                    className="btn btn-station btn-offline"
                                >
                                    Off-line
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedType(2)}
                                    className="btn btn-station btn-embrapa"
                                >
                                    Embrapa
                                </button>
                            </div>
                        </div>
                        <div className="mb-3 border border-primary pt-3 px-2">
                            <div className="mb-3 text-start px-3">
                                <label
                                    htmlFor="station-filter"
                                    className="form-label"
                                >
                                    Estação:
                                </label>
                                <input
                                    id="station-filter"
                                    type="text"
                                    className="form-control"
                                    placeholder="Nome da estação"
                                    value={searchStation}
                                    onChange={(e) =>
                                        setSearchStation(e.target.value)
                                    }
                                />
                            </div>
                            <div className="filter-stations">
                            <div className={isLoading ? 'd-block position-relative' : 'd-none'}>
                                <Loading />
                            </div>
                                { 
                                    !stations.length && (
                                        <p className='text-start ps-2 ms-1'>Não há estações disponíveis.</p>
                                    )
                                }
                                {stations
                                    .filter((station) => {
                                        return (
                                            station.online === selectedType &&
                                            station.nome_modulo
                                                .toLowerCase()
                                                .includes(
                                                    searchStation.toLowerCase()
                                                )
                                        );
                                    })
                                    .map((station) => (
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary btn-filter mx-0"
                                            key={station.modulo_id}
                                            onClick={() => {
                                                onChangeCoordinates(
                                                    parseFloat(
                                                        station.longitude
                                                    ),
                                                    parseFloat(station.latitude)
                                                );

                                                const el =
                                                    document.getElementById(
                                                        `station-${station.modulo_id}`
                                                    );

                                                el?.click();
                                            }}
                                        >
                                            <span>{station.nome_modulo}</span>
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                        <div className="mb-3 border border-primary pt-3 px-2 d-none">
                            <div className="mb-3 text-start px-3">
                                <label
                                    htmlFor="state-filter"
                                    className="form-label"
                                >
                                    Estado:
                                </label>
                                <input
                                    id="state-filter"
                                    type="text"
                                    className="form-control"
                                    placeholder="Nome do estado"
                                    value={searchState}
                                    onChange={(e) =>
                                        setSearchState(e.target.value)
                                    }
                                />
                            </div>
                            <div className="filter-states">
                                {states
                                    .filter((state) =>
                                        state.name
                                            .toLowerCase()
                                            .includes(searchState.toLowerCase())
                                    )
                                    .map((state) => (
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary btn-filter mx-0"
                                            key={state.id}
                                            onClick={() =>
                                                onChangeCoordinates(
                                                    state.lng,
                                                    state.lat
                                                )
                                            }
                                        >
                                            {state.name}
                                        </button>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}
            <button
                type="button"
                className="btn btn-expand material-icons"
                onClick={() => setShowFilters(!showFilters)}
            >
                keyboard_double_arrow_right
            </button>
            </div>
        </div>
    );
};

export default Filters;
