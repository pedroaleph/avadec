import {
    cumulativeStationVars,
    fullMonths,
    months,
    stationVarDict,
    stationVarKey,
} from 'core/utils/constants';
import { DailyData, StationVar, TimePeriod } from 'core/utils/models';
import { toSvg } from 'html-to-image';
import { useRef, useState } from 'react';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface Props {
    stationVar: StationVar;
    data: DailyData[];
    period: TimePeriod;
    interval: number[];
}

interface Config {
    name: string;
    label: string;
    color: string;
    isDisplayed: boolean;
    strokeDasharray: string | undefined;
}

export const tickFormatter = (period: TimePeriod) => {
    return (value: number | string | Date) => {
        const date = new Date(value);
        switch (period) {
            case 'monthly':
                return months[date.getMonth()] + '/' + date.getFullYear();
            default:
                return (
                    date.getDate() +
                    '/' +
                    (date.getMonth() + 1).toString().padStart(2, '0')
                );
        }
    };
};

export const labelFormatter = (period: TimePeriod) => {
    return (value: number | string | Date) => {
        const date = new Date(value);
        switch (period) {
            case 'monthly':
                return (
                    fullMonths[date.getMonth()] + ' de ' + date.getFullYear()
                );
            default:
                return date.toLocaleDateString();
        }
    };
};

export const formatter = (unit: string) => {
    return (e: number) => (
        <div data-testid="tooltip-value" className="text-white">
            {e.toFixed(2)}
            <span className="ps-1 unit">{unit}</span>
        </div>
    );
};

export const getMax = (
    stationVar: StationVar,
    items: DailyData[],
    defaultLimit: number
): number => {
    if (cumulativeStationVars.includes(stationVar)) {
        const key = stationVarKey[stationVar];
        const value = items.reduce(
            (max, item) => (max > item[key] ? max : item[key]),
            defaultLimit
        );

        if (value !== defaultLimit) {
            const truncatedValue = Math.trunc(value);
            const valueLength = truncatedValue.toString().length;

            const powerOfTen = Math.pow(10, valueLength - 1);
            const integerPart = Math.trunc(truncatedValue / powerOfTen);

            const max = integerPart * powerOfTen + powerOfTen;

            return max;
        }
    }

    return defaultLimit;
};

const CustomLegend = (color: string, configs: Config[]) => {
    return (
        <div className="d-flex justify-content-center align-items-center unit">
            {configs
                .filter((config) => config.isDisplayed)
                .map((config, index) => (
                    <div
                        key={index}
                        className="d-flex justify-content align-items-center mx-2"
                    >
                        <svg width="24" height="10" style={{ marginRight: 8 }}>
                            <line
                                x1="0"
                                y1="5"
                                x2="24"
                                y2="5"
                                stroke={color}
                                strokeWidth="3"
                                strokeDasharray={config.strokeDasharray || '0'}
                            />
                        </svg>
                        <span className="legend">{config.label}</span>
                    </div>
                ))}
        </div>
    );
};

const Chart = ({ stationVar, data, period, interval }: Props) => {
    const { label, limits, unit, color } = stationVarDict[stationVar];
    const min = limits[0];
    const max = getMax(stationVar, data, limits[1]);
    const tickCount = data.length > 7 ? data.length / 2 : data.length;
    const [keys, setKeys] = useState(stationVarDict[stationVar].keys);
    const chartRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const toggleKeyDisplay = (index: number) => {
        setKeys((prevKeys) =>
            prevKeys.map((key, i) =>
                i === index ? { ...key, isDisplayed: !key.isDisplayed } : key
            )
        );
    };

    const handleDownload = () => {
        if (!chartRef.current) return;

        setIsDownloading(true);

        toSvg(chartRef.current)
            .then((dataUrl) => {
                const link = document.createElement('a');
                const now = Date.now();
                link.download = now + '-' + label + '.svg';
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error('Não foi possivel baixar o gráfico.', err);
            })
            .finally(() => {
                setIsDownloading(false);
            });
    };

    return (
        <div
            className="w-100 card-base shadow chart-container mt-2 ps-0 position-relative"
            ref={chartRef}
        >
            <div className="mb-1 position-relative">
                <h6 className="fw-bold fs-6 mb-0">{label}</h6>
                <span className="ps-1 unit position-absolute top-0 end-0">
                    {unit}
                </span>
            </div>
            <div className="d-flex justify-content-end unit">
                {keys.length > 1 &&
                    keys.map((key, index) => (
                        <div
                            className="mb-1 ms-2 ps-1 d-flex align-items-center"
                            key={index}
                        >
                            <input
                                type="checkbox"
                                checked={key.isDisplayed}
                                onChange={() => toggleKeyDisplay(index)}
                            />
                            <span className="ms-1">{key.label}</span>
                        </div>
                    ))}
            </div>
            <ResponsiveContainer
                width={'100%'}
                height={keys.length > 1 ? '85%' : '92%'}
            >
                <LineChart
                    data-testid={'chart-' + stationVar}
                    data={data}
                    margin={{
                        top: 0,
                        right: 0,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <XAxis
                        type="number"
                        dataKey="time"
                        domain={interval}
                        tickFormatter={tickFormatter(period)}
                        tickCount={tickCount}
                    />
                    <YAxis type="number" domain={[min, max]} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Legend content={() => CustomLegend(color, keys)} />
                    <Tooltip
                        labelFormatter={labelFormatter(period)}
                        formatter={formatter(unit)}
                        separator=": "
                    />
                    {keys
                        .filter((key) => key.isDisplayed)
                        .map((key, index) => (
                            <Line
                                key={index}
                                type="linear"
                                name={key.label}
                                dataKey={key.name}
                                stroke={color}
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 0 }}
                                strokeDasharray={key.strokeDasharray}
                                isAnimationActive={false}
                            />
                        ))}
                </LineChart>
            </ResponsiveContainer>
            <button
                type="button"
                className="btn p-0 material-icons material-symbols-outlined text-primary position-absolute end-0 bottom-0 m-2 border-0"
                onClick={handleDownload}
                disabled={isDownloading}
                title='Download do gráfico'
            >
                download
            </button>
        </div>
    );
};

export default Chart;
