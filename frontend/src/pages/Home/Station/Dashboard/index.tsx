import Chart from 'core/components/Chart';
import { stationVariables } from 'core/utils/constants';
import { DailyData, TimePeriod } from 'core/utils/models';

interface Props {
    period: TimePeriod;
    data: DailyData[];
    interval: number[];
}

const Dashboard = ({ period, data, interval }: Props) => {
    return (
        <div className="row">
            {
                stationVariables.map((stationVar, index) => (
                    <div key={index} className="col-12 col-lg-6 col-xxl-4">
                        <Chart stationVar={stationVar} data={data} period={period} interval={interval} />
                    </div>
                ))
            }
        </div>
    );
};

export default Dashboard;
