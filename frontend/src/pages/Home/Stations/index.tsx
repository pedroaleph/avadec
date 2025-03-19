import './styles.scss';
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import request from 'core/utils/request';
import { Station } from 'core/utils/models';
import { useNavigate } from 'react-router-dom';
import Filters from './Filters';

interface MapboxGLWithWorker {
    workerClass?: typeof Worker;
}

(mapboxgl as MapboxGLWithWorker).workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default; // eslint-disable-line
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY ?? '';

interface Props {
    setStationId: (value: string) => void;
    setHeaderTitle: (value: { name: string, period?: string }) => void;
}

const Stations = ({ setStationId, setHeaderTitle }: Props) => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const [lng, setLng] = useState(-60.67312);
    const [lat, setLat] = useState(2.8307);
    const [zoom, setZoom] = useState(6.0);
    const [mapStyle, setMapStyle] = useState('streets-v11');
    const [stations, setStations] = useState<Station[]>([]);
    const [markers, setMarkes] = useState<mapboxgl.Marker[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('selected-station-id');
        setStationId('');
        setHeaderTitle({ name: 'Estações' });
    }, [setStationId, setHeaderTitle]);

    useEffect(() => {
        if (map) return;

        if (mapContainer.current) {
            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [lng, lat],
                zoom: 1.0,
            });

            map.flyTo({
                zoom: 8.15,
                essential: true,
            });
            setMap(map);
        }
    }, [lat, lng, zoom, map, mapStyle, stations.length]);

    useEffect(() => {
        map && map.setStyle(`mapbox://styles/mapbox/${mapStyle}`);
    }, [mapStyle, map]);

    useEffect(() => {
        map &&
            map.on('move', () => {
                setLng(parseFloat(map.getCenter().lng.toFixed(4)));
                setLat(parseFloat(map.getCenter().lat.toFixed(4)));
                setZoom(parseFloat(map.getZoom().toFixed(2)));
            });
    }, [map]);

    useEffect(() => {
        if (!map || stations.length) {
            return;
        }

        request.get('/stations').then((res) => {
            setStations(res.data);
        });
    }, [stations, map]);

    useEffect(() => {
        if (markers.length) {
            return;
        }
        if (map && stations.length) {
            const markers = stations.map((station) => {
                const el = document.createElement('div');
                el.className = `marker marker-${station.online}`;
                el.id = `station-${station.modulo_id}`;

                const lng = parseFloat(station.longitude);
                const lat = parseFloat(station.latitude);

                const marker = new mapboxgl.Marker({ element: el })
                    .setLngLat([lng, lat])
                    .setPopup(
                        new mapboxgl.Popup().setHTML(
                            `<h6 class="fw-bold mb-0">
                                ${station.nome_modulo}
                            </h6>
                            <button type="button" id="btn-station" class="btn btn-primary material-icons p-1">
                                chevron_right
                            </button>`
                        )
                    )
                    .addTo(map);

                marker.getElement().addEventListener('click', () => {
                    setTimeout(() => {
                        const btn = document.getElementById('btn-station');
                        btn?.addEventListener('click', () => {
                            localStorage.setItem(
                                'selected-station-id',
                                station.modulo_id.toString()
                            );

                            navigate(`/stations/${station.modulo_id}`);
                        });
                    }, 0);
                });

                return marker;
            });

            setMarkes(markers);
        }
    }, [map, stations, markers, navigate]);

    return (
        <div className="stations-container">
            <Filters stations={stations} map={map} markers={markers} />
            <div
                className="w-100 position-relative h-100"
            >
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
                            onClick={() => setMapStyle('streets-v11')}
                        >
                            estradas
                        </button>
                        <button
                            type="button"
                            className="map-dark btn btn-secondary"
                            onClick={() => setMapStyle('dark-v10')}
                        >
                            escuro
                        </button>
                        <button
                            type="button"
                            className="map-satellite btn btn-embrapa"
                            onClick={() => setMapStyle('satellite-v9')}
                        >
                            satélite
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Stations;
