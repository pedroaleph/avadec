import { HourlyData, HourlyDataRaw } from "./models";

export default class Utils {
    static formattedDate(value: string): string {
        const [day, month, year] = value.split('/');
        return `${year}-${month}-${day}`;
    }

    static timeToMilliseconds(time: string): number {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours + (minutes * 60 + seconds) / 3600;;
    }

    static formattedHourlyData(raw: HourlyDataRaw[]): HourlyData[] {
        return raw.map(item => ({
            time: this.timeToMilliseconds(item.horario),
            precipitation: item.precipitacao,
            airTemperature: item.temperaturaAr,
            airHumidity: item.umidadeAr,
            wind: item.vento
        }));
    }
    
    static millisecondsToTime(value: number): string {
        const hours = Math.trunc(value);
        const calc = Math.trunc((value - hours) * 3600);
        const minutes = Math.trunc(calc / 60);
        const seconds = calc % 60;
    
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
    
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }
}