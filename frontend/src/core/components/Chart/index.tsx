import { cumulativeStationVars, fullMonths, months, stationVarDict, stationVarKey } from "core/utils/constants";
import { DailyData, StationVar, TimePeriod } from "core/utils/models";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Props {
    stationVar: StationVar;
    data: DailyData[];
    period: TimePeriod;
    interval: number[];
}

export const tickFormatter = (period: TimePeriod) => {
    return (value: number | string | Date) => {
        const date = new Date(value);
        switch(period) {
            case "monthly":
                return months[date.getMonth()] + '/' + date.getFullYear();
            default:
                return date.getDate() + '/' + (date.getMonth() + 1).toString().padStart(2, '0');
        }
    };
};

export const labelFormatter = (period: TimePeriod) => {
    return (value: number | string | Date) => {
        const date = new Date(value);
        switch(period) {
            case "monthly":
                return fullMonths[date.getMonth()] + ' de ' + date.getFullYear();
            default:
                return date.toLocaleDateString();
        }
    };
};

export const formatter = (unit: string) => {
    return (e: number) => (
        <div data-testid="tooltip-value">
            {e.toFixed(2)}
            <span className="ps-1 unit">
                {unit}
            </span>
        </div>
    );
}

export const getMax = (stationVar: StationVar, items: DailyData[], maxLimit: number) => {
    if (cumulativeStationVars.includes(stationVar)) {
        const key = stationVarKey[stationVar];
        const value = items.reduce((max, item) => max > item[key] ? max : item[key], maxLimit);

        if (value !== maxLimit) {
            const truncatedValue = Math.trunc(value);
            const valueLength = truncatedValue.toString().length;
    
            const powerOfTen = Math.pow(10, valueLength - 1);
            const integerPart = Math.trunc(truncatedValue / powerOfTen);
    
            const max = integerPart * powerOfTen + powerOfTen;

            return max;
        }
    }

    return maxLimit;
}

const Chart = ({ stationVar, data, period, interval }: Props) => {
    const { label, limits, unit, keys } = stationVarDict[stationVar];
    const min = limits[0];
    const max = getMax(stationVar, data, limits[1]);
    const tickCount = data.length > 7 ? data.length / 2 : data.length;

    return (
        <div className="w-100 card-base shadow chart-container mt-2 ps-0">
            <div className="mb-1 position-relative">
                <h6 className="fw-bold fs-6 mb-0">{label}</h6>
                <span className="ps-1 unit position-absolute top-0 end-0">{unit}</span>
            </div>
            <ResponsiveContainer width={'100%'} height={'95%'}>
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
                    <Tooltip
                        labelFormatter={labelFormatter(period)}
                        formatter={formatter(unit)}
                        separator=": "
                    />
                    {
                        keys.map((key, index) => (
                            <Line
                                key={index}
                                type="linear"
                                name={key.label}
                                dataKey={key.name}
                                stroke={key.color}
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 0 }}
                            />
                        ))
                    }
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default Chart;