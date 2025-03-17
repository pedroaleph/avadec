import Header from 'core/components/Header';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Stations from './Stations';
import { useEffect, useState } from 'react';
import StationSelected from './Station';
import './styles.scss';

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [stationId, setStationId] = useState(
        localStorage.getItem('selected-station-id') ?? ''
    );
    const path = '/stations' + (stationId ? '/' + stationId : '');
    const [showSidebar, setShowSidebar] = useState(false);
    const [title, setTitle] = useState({ name: 'Estações' });

    useEffect(() => {
        location.pathname === '/' && navigate(path);
    }, [navigate, location, path]);

    const handleResize = () => {
        setShowSidebar(window.innerWidth >= 576);
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="d-flex w-100">
            <div className="w-100">
                <Header
                    title={title}
                    menuState={showSidebar}
                    onChangeMenuState={setShowSidebar}
                />
                <div className="home-content">
                    <Routes>
                        <Route
                            path="/stations"
                            element={
                                <Stations
                                    setStationId={setStationId}
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
