import { NavLink } from 'react-router-dom';
import './styles.scss';
import { useEffect, useState } from 'react';
import { default as stationIcon } from 'core/assets/images/weather-station-icon-2.jpg';

interface Props {
    stationId: string;
    stationName: string;
    stationPeriod: string;
    show: boolean;
    onChangeState: (value: boolean) => void;
}

const Siderbar = ({ show, onChangeState, stationId, stationName, stationPeriod }: Props) => {
    const [absolute, setAbsolute] = useState(false);

    const handleResize = () => {
        setAbsolute(window.innerWidth <= 576);
    };

    useEffect(() => {
        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className='screen-mode'>
            {absolute && show && <div className="backyard" onClick={() => onChangeState(false)}></div>}
            <div
                className="sidebar-container"
                style={{
                    width: show ? 285 : 0,
                    position: absolute ? 'absolute' : 'relative',
                }}
            >
                {show && (
                    <nav className="sidebar-content position-relative">
                        <header className='px-3 py-3 text-start'>
                            <h1 className='mb-0 fw-bold lh-1'>Avadec</h1>
                        </header>
                        <ul>
                            {stationId ? (
                                <>
                                    <li>
                                        <NavLink
                                            to={`/stations/${stationId}`}
                                            className="btn btn-sidebar py-1"
                                            end
                                        >
                                            Estação selecionada:
                                            <div className="d-flex align-items-center pb-1">
                                                <img className='p-1' width={40} height={40} src={stationIcon} alt="" />
                                                <div className='px-2 pt-1'>
                                                    <p className='fw-normal mb-0 lh-1'>{ stationName }</p>
                                                    <code className='fw-lighter text-secondary fst-italic'>{ stationPeriod }</code>
                                                </div>
                                            </div>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to={`/stations/${stationId}/last-year`}
                                            className="btn btn-sidebar"
                                        >
                                            Último ano
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to={`/stations/${stationId}/search-period`}
                                            className="btn btn-sidebar"
                                        >
                                            Pesquisar periodo
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to={`/stations/${stationId}/average-data`}
                                            className="btn btn-sidebar"
                                        >
                                            Dados médios
                                        </NavLink>
                                    </li>
                                </>
                            ) : (
                                <li>
                                    <NavLink
                                        to="/stations"
                                        className="btn btn-sidebar py-1"
                                        end
                                    >
                                        Estação selecionada:
                                        <div className="d-flex align-items-center pt-1 pb-2">
                                            <div className='station-box'></div>
                                            <span className='fw-normal px-2 text-secondary fst-italic'>Nenhuma</span>
                                        </div>
                                    </NavLink>
                                </li>
                            )}
                        </ul>
                    </nav>
                )}
            </div>
        </div>
    );
};

export default Siderbar;
