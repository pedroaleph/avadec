import Chart from 'core/components/Chart';
import Collapse from 'core/components/Collapse';
import { DailyData, TimePeriod } from 'core/utils/models';

interface Props {
    period: TimePeriod;
    data: DailyData[];
    interval: number[];
}

const Dashboard = ({ period, data, interval }: Props) => {
    return (
        <div className='mt-2 mb-4'>
            <Collapse title='Clima Atmosférico'>
             <div className='row'>
                <div className="col-12 col-lg-6 col-xxl-4">
                    <Chart stationVar='airTemperature' data={data} period={period} interval={interval} />
                </div>
                <div className="col-12 col-lg-6 col-xxl-4">
                    <Chart stationVar='airHumidity' data={data} period={period} interval={interval} />
                </div>
                <div className="col-12 col-lg-6 col-xxl-4">
                    <Chart stationVar='airPressure' data={data} period={period} interval={interval} />
                </div>
                <div className="col-12 col-lg-6">
                    <Chart stationVar='precipitation' data={data} period={period} interval={interval} />
                </div>
                <div className="col-12 col-lg-6">
                    <Chart stationVar='wind' data={data} period={period} interval={interval} />
                </div>
            </div>
            </Collapse>
            <Collapse title='Condições do Solo'>
                <div className="row">
                    <div className="col-12 col-lg-6">
                        <Chart stationVar='soilTemperature' data={data} period={period} interval={interval} />
                    </div>
                    <div className="col-12 col-lg-6">
                        <Chart stationVar='soilHumidity' data={data} period={period} interval={interval} />
                    </div>
                </div>
            </Collapse>
            <Collapse title='Radiação Solar'>
                <div className="row">
                    <div className="col-12 col-lg-6">
                        <Chart stationVar='radiation' data={data} period={period} interval={interval} />
                    </div>
                    <div className="col-12 col-lg-6">
                        <Chart stationVar='evapotranspiration' data={data} period={period} interval={interval} />
                    </div>
                </div>
            </Collapse>
        </div>
    );
};

export default Dashboard;
