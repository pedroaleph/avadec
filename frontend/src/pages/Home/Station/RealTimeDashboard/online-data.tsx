import { stationVarColor, stationVarLabel, stationVarLimits, stationVarUnit } from 'core/utils/maps';
import { HourlyData, OnlineData, Station, StationVar } from 'core/utils/models';
import request from 'core/utils/request';
import Utils from 'core/utils/utils';
import { useEffect, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Props {
    station: Station;
    data: OnlineData;
}

const OnlineDashboard = ({ station, data }: Props) => {
    const [selectedKey, setSelectedKey] = useState<StationVar>('precipitation');
    const [hourlyData, setHourlyData] = useState<HourlyData[]>();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (station && data && !isLoaded) {
            const date = new Date(data.data);

            request
                .get(`/station_data/${station.modulo_id}`, { params: { date } })
                .then((res) => {
                    const result = Utils.formattedHourlyData(res.data.content);
                    setHourlyData(result);
                    setIsLoaded(true);
                });
        }
    }, [station, data, isLoaded]);

    return (
        <div className="dashboard-container">
            <div className="text-center card-base shadow">
                <h5 className="fw-bold fs-5 mb-0">
                    {station?.municipio} - {station?.estado}
                </h5>
                <span className="fs-6">
                    {data?.data} {data?.ultHor}
                </span>
            </div>
            <div className="d-lg-flex">
                <button
                    type="button"
                    className="btn card-base card-info shadow position-relative"
                    onClick={() => setSelectedKey('precipitation')}
                >
                    <h2 className="mb-0 p-2 ps-4 pb-0">
                        {data?.precipitacao}
                        <small className="fs-6"> mm</small>
                    </h2>
                    <span className="material-icons position-absolute fs-1 end-0 top-0 text-precipitation p-2">
                        water
                    </span>
                    <h6> Precipitação </h6>
                </button>
                <button
                    type="button"
                    className="btn card-base card-info shadow position-relative"
                    onClick={() => setSelectedKey('airTemperature')}
                >
                    <h2 className="mb-0 p-2 ps-4 pb-0">
                        {data?.temperatura}
                        <small className="fs-6"> °C</small>
                    </h2>
                    <span className="material-icons position-absolute fs-1 end-0 top-0 text-temperature p-2">
                        thermostat
                    </span>
                    <h6> Temperatura </h6>
                </button>
                <button
                    type="button"
                    className="btn card-base card-info shadow position-relative"
                    onClick={() => setSelectedKey('airHumidity')}
                >
                    <h2 className="mb-0 p-2 ps-4 pb-0">
                        {data?.umidade}
                        <small className="fs-6"> %</small>
                    </h2>
                    <span className="material-symbols-outlined position-absolute fs-1 end-0 top-0 text-humidity p-2">
                        humidity_percentage
                    </span>
                    <h6> Umidade </h6>
                </button>
                <button
                    type="button"
                    className="btn card-base card-info shadow position-relative me-0"
                    onClick={() => setSelectedKey('wind')}
                >
                    <h2 className="mb-0 p-2 ps-4 pb-0">
                        {data?.vento}
                        <small className="fs-6"> km/h</small>
                    </h2>
                    <span className="material-icons position-absolute fs-1 end-0 top-0 text-wind p-2">
                        air
                    </span>
                    <h6> Vento </h6>
                </button>
            </div>
            <div className="w-100 card-base shadow chart-container mt-2">
                <h4 className="fw-bold"> Horas </h4>
                <ResponsiveContainer width={'100%'} height={'90%'}>
                    <LineChart
                        data={hourlyData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="time"
                            type="number"
                            domain={[0, 24]}
                            tickFormatter={(v) => v + 'h'}
                            tickCount={hourlyData?.length}
                            allowDecimals={false}
                        />
                        <YAxis
                            domain={stationVarLimits.get(selectedKey)}
                            type="number"
                        />
                        <Tooltip
                            labelFormatter={(v) =>
                                `Horário: ${Utils.millisecondsToTime(v)}`
                            }
                            formatter={(e) => (
                                <>
                                    {e}{' '}
                                    <span className="unit">
                                        {stationVarUnit.get(selectedKey)}
                                    </span>
                                </>
                            )}
                            separator=": "
                        />
                        <Legend />
                        <Line
                            type="linear"
                            name={stationVarLabel.get(selectedKey)}
                            dataKey={selectedKey}
                            stroke={stationVarColor.get(selectedKey)}
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default OnlineDashboard;
