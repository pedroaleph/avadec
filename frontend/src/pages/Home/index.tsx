import Header from 'core/components/Header';
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import Stations from './Stations';
import { useEffect, useState } from 'react';
import StationSelected from './Station';
import './styles.scss';

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const [stationId, setStationId] = useState(
        params.id || localStorage.getItem('selected-station-id') || ''
    );
    const path = '/stations' + (stationId ? '/' + stationId : '');
    const [title, setTitle] = useState({ name: 'Estações' });

    useEffect(() => {
        location.pathname === '/' && navigate(path);
    }, [navigate, location, path]);

    return (
        <div className="d-flex w-100">
            <div className="w-100">
                <Header title={title} />
                <div className="home-content">
                    <Routes>
                        <Route
                            path="/stations"
                            element={
                                <Stations
                                    setHeaderTitle={setTitle}
                                />
                            }
                        />
                        <Route
                            path="/stations/:id/*"
                            element={
                                <StationSelected
                                    stationId={stationId}
                                    setStationId={setStationId}
                                    setHeaderTitle={setTitle}
                                />
                            }
                        />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default Home;
