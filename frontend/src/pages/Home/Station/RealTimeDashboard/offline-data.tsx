import { months } from 'core/utils/constants';
import {
    stationVarColor,
    stationVarLabel,
    stationVarLimits,
    stationVarUnit,
} from 'core/utils/maps';
import { Month, OfflineData } from 'core/utils/models';
import { useEffect, useState } from 'react';
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface Props {
    data: OfflineData;
}

const monthLabel = {
    jan: 'Janeiro',
    fev: 'Fevereiro',
    mar: 'Março',
    abr: 'Abril',
    mai: 'Maio',
    jun: 'Junho',
    jul: 'Julho',
    ago: 'Agosto',
    set: 'Setembro',
    out: 'Outubro',
    nov: 'Novembro',
    dez: 'Dezembro',
};

const OfflineDashboard = ({ data }: Props) => {
    const [monthData, setMonthData] = useState<{}[]>();

    useEffect(() => {
        const result = months.map((month, index) => ({
            id: index + 1,
            precipitation: parseFloat(data.Precipitacao[index]),
            month: month.toLowerCase(),
        }));

        setMonthData(result);
    }, [data]);

    return (
        <div className="dashboard-container">
            <div className="w-100 card-base shadow chart-container mt-2">
                <div className="position-relative">
                    <h4 className="fw-bold pt-3 pb-1"> Precipitação </h4>
                    <span className="position-absolute end-0 top-0">
                        {data.Anoi} a {data.Anof}
                    </span>
                </div>
                <ResponsiveContainer width={'100%'} height={'90%'}>
                    <LineChart
                        width={500}
                        height={300}
                        data={monthData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tickLine={false} />
                        <YAxis
                            domain={stationVarLimits.get('precipitation')}
                            type="number"
                            dataKey="precipitation"
                        />
                        <Tooltip
                            labelFormatter={(v: Month) =>
                                `Mês: ${monthLabel[v]}`
                            }
                            formatter={(e) => (
                                <>
                                    {e}{' '}
                                    <span className="unit">
                                        {stationVarUnit.get('precipitation')}
                                    </span>
                                </>
                            )}
                            separator=": "
                        />
                        <Line
                            type="linear"
                            name={stationVarLabel.get('precipitation')}
                            dataKey="precipitation"
                            stroke={stationVarColor.get('precipitation')}
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

export default OfflineDashboard;
