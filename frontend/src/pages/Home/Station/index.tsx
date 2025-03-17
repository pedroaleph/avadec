import './styles.scss';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Dashboard from './Dashboard';
import { DailyData, Period, Station, TimePeriod } from 'core/utils/models';
import request from 'core/utils/request';
import GoBack from 'core/components/GoBack';
import PeriodButtons from 'core/components/PeriodButtons';

interface Props {
    stationId: string;
    setStationId: (value: string) => void;
    setHeaderTitle: (value: { name: string, period?: string }) => void;
}

const getStartByPeriod = (period: number, endDate: Date | string) => {
    const date = new Date(endDate);
    switch(period) {
        case 0:
            return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 6);
        case 1:
            return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 14);
        case 2:
            return new Date(date.getFullYear(), date.getMonth() - 1, date.getDate() + 1);
        case 3:
            return new Date(date.getFullYear() - 1, date.getMonth(), date.getDate() + 1);
        default:
            return date;
    }
};

const timePeriodDict: { [key: number]: TimePeriod } = {
    0: 'daily',
    1: 'daily',
    2: 'daily',
    3: 'monthly'
}

const StationSelected = ({
    stationId,
    setStationId,
    setHeaderTitle,
}: Props) => {
    const params = useParams();
    const [station, setStation] = useState<Station>();
    const [data, setData] = useState<DailyData[]>();
    const [isLoaded, setIsLoaded] = useState(false);
    const [period, setPeriod] = useState<Period>(2);
    const [timePeriod, setTimePeriod]= useState<TimePeriod>('daily');
    const [interval, setInterval] = useState<number[]>([]);

    useEffect(() => {
        if (params.id && params.id !== stationId) {
            setStationId(params.id);
            localStorage.setItem('selected-station-id', params.id);
        }
    }, [params, stationId, setStationId]);

    useEffect(() => {
        stationId &&
            !isLoaded &&
            request
                .get(`/stations/${stationId}`)
                .then((res) => {
                    setIsLoaded(true);
                    const data = res.data;
                    setStation(data);
                });
    }, [stationId, isLoaded]);

    useEffect(() => {
        if(station) {
            const end = new Date(station.data);
            const start = getStartByPeriod(period, end);
            const path = `/daily-data/${stationId}`;
            const currentPeriod = timePeriodDict[period];
            const currentInterval = [start.getTime(), end.getTime()];
            setTimePeriod(currentPeriod);
            setInterval(currentInterval);
            const params = {
                start,
                end,
                period: currentPeriod
            }
            request.get(path, { params }).then((res) => {
                setData(res.data);
            });
        }
    }, [station, stationId, period]);

    useEffect(() => {
        if(station) {
            const inicio = new Date(station.dataIni).toLocaleDateString();
            const fim = new Date(station.data).toLocaleDateString();

            const period = inicio + ' - ' + fim;

            setHeaderTitle({ name: station.nome_modulo, period });
        }
    }, [station, setHeaderTitle]);

    return (
        <div className="w-100 position-relative">
            <div className="px-3 d-flex align-items-center flex-wrap pb-1 position-sticky top-0 z-1 bg-default border-primary border-bottom">
                <div className="py-2">
                    <GoBack path='/stations' />
                </div>
                <div className="ms-auto py-2">
                    <PeriodButtons period={period} setPeriod={setPeriod} />
                </div>
            </div>
            <div className="pt-2 px-3 station-container">
                { station && data && <Dashboard period={timePeriod} data={data} interval={interval} /> }
            </div>
        </div>
    );
};

export default StationSelected;
