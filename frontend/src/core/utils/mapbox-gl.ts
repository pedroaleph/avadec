// core/utils/mapbox-gl.ts
import mapboxgl from 'mapbox-gl';
import { MapStypeType, Station } from './models';

interface MapboxGLWithWorker {
    workerClass?: typeof Worker;
}

interface MapConfig {
    container: HTMLElement;
    center: [number, number];
    zoom: number;
    style?: string;
    onMove?: (lng: number, lat: number, zoom: number) => void;
    onStationClick?: (station: Station) => void;
}

const mapStyle = {
    streets: 'streets-v11',
    dark: 'dark-v10',
    satellite: 'satellite-v9'
};

class MapboxGL {
    private static initialized = false;
    private static map: mapboxgl.Map;
    private static markers: mapboxgl.Marker[] = [];

    static init() {
        if (this.initialized) return;

        (mapboxgl as MapboxGLWithWorker).workerClass =
            require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default; // eslint-disable-line

        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY ?? '';
        this.initialized = true;
    }

    static createMap(config: MapConfig): mapboxgl.Map {
        this.init();

        const {
            container,
            center,
            zoom,
            style = 'streets-v11',
            onMove,
        } = config;

        this.map = new mapboxgl.Map({
            container,
            style: `mapbox://styles/mapbox/${style}`,
            center,
            zoom,
        });

        this.map.flyTo({ zoom: 8.15, essential: true });

        if (onMove) {
            this.map.on('move', () => {
                const center = this.map.getCenter();
                const zoom = this.map.getZoom();
                
                onMove(
                    parseFloat(center.lng.toFixed(4)),
                    parseFloat(center.lat.toFixed(4)),
                    parseFloat(zoom.toFixed(2))
                );
            });
        }

        return this.map;
    }

    static changeStyle(style: MapStypeType) {
        this.map?.setStyle(`mapbox://styles/mapbox/${mapStyle[style]}`);
    }

    static createMarkers(stations: Station[], onClick: (station: Station) => void) {
        if (!this.map) return;

        this.clearMarkers();

        this.markers = stations.map((station) => {
            const el = document.createElement('div');
            el.className = `marker marker-${station.online}`;
            el.id = `station-${station.modulo_id}`;

            const lng = parseFloat(station.longitude);
            const lat = parseFloat(station.latitude);

            const marker = new mapboxgl.Marker({ element: el })
                .setLngLat([lng, lat])
                .setPopup(
                    new mapboxgl.Popup().setHTML(`
                        <h6 class="fw-bold mb-0">${station.nome_modulo}</h6>
                        <button type="button" id="btn-station" class="btn btn-primary material-icons p-1">
                            chevron_right
                        </button>
                    `)
                )
                .addTo(this.map);

            marker.getElement().addEventListener('click', () => {
                setTimeout(() => {
                    const btn = document.getElementById('btn-station');
                    btn?.addEventListener('click', () => onClick(station));
                }, 0);
            });

            return marker;
        });
    }

    static flyToStation(station: Station) {
        const longitude = parseFloat(station.longitude);
        const latitude = parseFloat(station.latitude);

        this.map?.flyTo({
            center: [longitude, latitude],
            essential: true,
            zoom: 8.15,
        });

        document.getElementById(`station-${station.modulo_id}`)?.click();
    }

    private static clearMarkers() {
        this.markers.forEach(marker => marker.remove());
        this.markers = [];
    }

    static get instance(): mapboxgl.Map {
        return this.map;
    }
}

export default MapboxGL;
