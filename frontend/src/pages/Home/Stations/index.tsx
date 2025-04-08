import './styles.scss';
import { useEffect, useRef, useState } from 'react';
import MapboxGL from 'core/utils/mapbox-gl';
import request from 'core/utils/request';
import { Station } from 'core/utils/models';
import { useNavigate } from 'react-router-dom';
import Filters from './Filters';

interface Props {
    setStationId: (value: string) => void;
    setHeaderTitle: (value: { name: string; period?: string }) => void;
}

const initialCenter: [number, number] = [-60.67312, 2.8307];
const styles = ['streets-v11', 'dark-v10', 'satellite-v9'];

const Stations = ({ setStationId, setHeaderTitle }: Props) => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const [zoom, setZoom] = useState(6.0);
    const [lng, setLng] = useState(initialCenter[0]);
    const [lat, setLat] = useState(initialCenter[1]);
    const [mapStyle, setMapStyle] = useState(0);
    const [stations, setStations] = useState<Station[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('selected-station-id');
        setStationId('');
        setHeaderTitle({ name: 'Estações' });
    }, [setStationId, setHeaderTitle]);

    useEffect(() => {
        if (!mapContainer.current) return;

        MapboxGL.createMap({
            container: mapContainer.current,
            center: initialCenter,
            zoom: 1.0,
            style: styles[0],
            onMove: (lng, lat, zoom) => {
                setLng(lng);
                setLat(lat);
                setZoom(zoom);
            },
        });
    }, []);

    useEffect(() => {
        MapboxGL.changeStyle(styles[mapStyle]);
    }, [mapStyle]);

    useEffect(() => {
        setIsLoading(true);
        request
            .get('/stations')
            .then((res) => setStations(res.data))
            .catch(() => setStations([]))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        if (!stations.length) return;

        MapboxGL.createMarkers(stations, (station) => {
            localStorage.setItem(
                'selected-station-id',
                station.modulo_id.toString()
            );
            navigate(`/stations/${station.modulo_id}`);
        });
    }, [stations, navigate]);

    const onChangeStation = (station: Station) => {
        MapboxGL.flyToStation(station);
    };

    return (
        <div className="stations-container">
            <Filters
                stations={stations}
                onChange={onChangeStation}
                isLoading={isLoading}
            />
            <div className="w-100 position-relative h-100">
                <div className="position-absolute bottom-0 top-0 start-0 end-0">
                    <div
                        ref={mapContainer}
                        className="map-container border border-1 border-primary"
                    />
                    <div className="map-coordinates">
                        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                    </div>
                    <div className="map-style">
                        <button
                            type="button"
                            className="map-streets btn btn-offline"
                            onClick={() => setMapStyle(0)}
                        >
                            Estradas
                        </button>
                        <button
                            type="button"
                            className="map-dark btn btn-secondary"
                            onClick={() => setMapStyle(1)}
                        >
                            Escuro
                        </button>
                        <button
                            type="button"
                            className="map-satellite btn btn-embrapa"
                            onClick={() => setMapStyle(2)}
                        >
                            Satélite
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Stations;
