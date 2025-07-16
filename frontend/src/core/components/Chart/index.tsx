import {
    cumulativeStationVars,
    fullMonths,
    months,
    stationVarDict,
    stationVarKey,
} from 'core/utils/constants';
import { DailyData, StationVar, StationVarKey, TimePeriod } from 'core/utils/models';
import { toSvg } from 'html-to-image';
import { useRef, useState } from 'react';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ReferenceArea,
    ReferenceLine,
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

interface TickConfig {
    x: number;
    y: number;
    min: number;
    max: number;
    payload: { value: number };
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

const CustomTick = ({ x, y, payload, min, max }: TickConfig) => {
  const value = payload.value;

  let fill = '#666';
  if (value === min) {
    fill = '#00BFC4';
  } else if (value === max) {
    fill = '#FF5733';
  }

  return (
    <text x={x} y={y + 4} textAnchor="end" fill={fill} fontSize={12}>
        {value}
    </text>
  );
};

const downloadCSV = (data: DailyData[], stationVar: StationVar) => {
    if (!data || !data.length) return;
    const keys = stationVarDict[stationVar].keys.map(key => key.name as StationVarKey);

    const csv = [
        'data,' + keys.join(','),
        ...data.map(row => {
            const date = new Date(row.data).toLocaleDateString() + ',';
            const values = keys.map(k => row[k]).join(',');

            return  date + values;
        }),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const now = Date.now();
    const filename = now + '-' + stationVarDict[stationVar].label + '.csv';

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const Chart = ({ stationVar, data, period, interval }: Props) => {
    const { label, limits, unit, color, reference, yticks } = stationVarDict[stationVar];
    const min = limits[0];
    const max = getMax(stationVar, data, limits[1]);
    yticks[yticks.length - 1] = max;
    const tickCount = data.length > 7 ? data.length / 2 : data.length;
    const [keys, setKeys] = useState(stationVarDict[stationVar].keys);
    const chartRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const isCumulativeAndByMonthly = period === 'monthly' && cumulativeStationVars.includes(stationVar);

    const toggleKeyDisplay = (index: number) => {
        setKeys((prevKeys) =>
            prevKeys.map((key, i) =>
                i === index ? { ...key, isDisplayed: !key.isDisplayed } : key
            )
        );
    };

    const handleDownload = () => {
        if (!chartRef.current) return;

        setIsOpen(false);
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
    };

    const handleDownloadCSV = () => {
        if (!data || !data.length) return;

        setIsOpen(false);
        downloadCSV(data, stationVar);
    }

    return (
        <div
            className="w-100 card-base shadow chart-container mt-2 ps-0 position-relative z-0"
            ref={chartRef}
            onMouseOver={() => setIsOpen(isOpen)}
            onMouseOut={() => setIsOpen(false)}
        >
            <button type='button' className='btn p-1 material-icons position-absolute start-0 top-0 ms-2 mt-2 z-1' onClick={() => setIsOpen(!isOpen)}>menu</button>
            {isOpen && (
                <div className='d-flex flex-column border rounded-1 bg-white position-absolute top-0 start-0 ms-2 mt-5 z-1 w-auto py-1'>
                    <button
                        type="button"
                        className="btn m-0 px-2 py-1 btn-outline-primary text-start border-0 rounded-0"
                        onClick={handleDownload}
                    >
                        Baixar imagem SVG
                    </button>
                    <button
                        type="button"
                        className="btn m-0 px-2 py-1 btn-outline-primary text-start border-0 rounded-0"
                        onClick={handleDownloadCSV}
                    >
                        Baixar CSV
                    </button>
                </div>
            )}
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
                    <YAxis
                        type="number"
                        domain={[min, max]}
                        ticks={isCumulativeAndByMonthly ? undefined : yticks}
                        tick={isCumulativeAndByMonthly ? undefined : (props) => 
                            <CustomTick
                                x={props.x}
                                y={props.y}
                                payload={props.payload}
                                min={reference.min}
                                max={reference.max}
                            />
                        }
                    />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Legend content={() => CustomLegend(color, keys)} />
                    <Tooltip
                        labelFormatter={labelFormatter(period)}
                        formatter={formatter(unit)}
                        separator=": "
                    />
                    {!isCumulativeAndByMonthly && <>
                            <ReferenceLine
                                y={reference.min}
                                stroke="#33B5E5"
                                strokeDasharray='5 5'
                                label={{ value: 'Mín. esperado', position: 'right', fill: '#33B5E5', fontSize: 12 }}
                            />
                            <ReferenceLine
                                y={reference.max}
                                stroke="#FFBB33"
                                strokeDasharray='5 5'
                                label={{ value: 'Máx. esperado', position: 'right', fill: '#FFBB33', fontSize: 12 }}
                            />
                            <ReferenceArea
                                y1={reference.min}
                                y2={limits[0]}
                                strokeOpacity={0}
                                fill="#33B5E5"
                                fillOpacity={0.2}
                            />
                            <ReferenceArea
                                y1={limits[1]}
                                y2={reference.max}
                                strokeOpacity={0}
                                fill="#FFBB33"
                                fillOpacity={0.2}
                            />
                        </>}
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
        </div>
    );
};

export default Chart;
