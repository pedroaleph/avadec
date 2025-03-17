import { OfflineData, OnlineData, Station } from 'core/utils/models';
import { useEffect, useState } from 'react';
import OnlineDashboard from './online-data';
import OfflineDashboard from './offline-data';
interface Props {
    station?: Station;
    onlineData?: OnlineData;
    offlineData?: OfflineData;
}

const Dashboard = ({ station, onlineData, offlineData }: Props) => {
    const [isOnline, setIsOnline] = useState<boolean>(false);

    useEffect(() => {
        setIsOnline(station?.online === 1);
    }, [station]);

    return (
        <>
            {station &&
                (isOnline
                    ? onlineData && (
                          <OnlineDashboard
                              station={station}
                              data={onlineData}
                          />
                      )
                    : offlineData && <OfflineDashboard data={offlineData} />
                )
            }
        </>
    );
};

export default Dashboard;
