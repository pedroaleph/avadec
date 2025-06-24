export interface Station {
    modulo_id: number,
    nome_modulo: string,
    municipio: string,
    altitude: number,
    estado: string,
    longitude: string,
    latitude: string,
    responsavel: string,
    proprietario: string,
    gestor: string,
    tipo: string,
    online: StationType,
    inicio: string | Date,
    termino: string | Date
}

export interface OnlineData {
    data: string;
    dataIni: string;
    precipitacao: number;
    temperatura: number;
    ultHor: string;
    umidade: number;
    vento: number;
}

export interface DailyData {
    modulo_id: number;
    data: string | Date;
    time?: number;
    precipitacao: number;
    pressaoArMedia: number;
    pressaoArMaxima: number;
    pressaoArMinima: number;
    temperaturaArMedia: number;
    temperaturaArMaxima: number;
    temperaturaArMinima: number;
    temperaturaSoloMedia: number;
    temperaturaSoloMaxima: number;
    temperaturaSoloMinima: number;
    umidadeArMedia: number;
    umidadeArMaxima: number;
    umidadeArMinima: number;
    umidadeSoloMedia: number;
    umidadeSoloMaxima: number;
    umidadeSoloMinima: number;
    ventoMedia: number;
    ventoMaxima: number;
    ventoMinima: number;
    mediaUv: number;
    maxUv: number;
    minUv: number;
    evapotranspiracao: number;
}

export interface OfflineData {
    Anoi: string,
    Anof: string,
    dataIni: string,
    dataFim: string,
    Precipitacao: string[];
}

export interface HourlyDataResponse {
    station_id: string,
    date: Date,
    content: HourlyDataRaw[],
    total: number,
}

export interface HourlyDataRaw {
    data: Date,
    anoElNino: number,
    anoLaNina: number,
    horario: string,
    precipitacao: number,
    temperaturaAr: number,
    umidadeAr: number,
    pressaoAr: number,
    temperaturaSolo: number,
    umidadeSolo: number,
    vento: number,
    nivelUv: number,
}

export interface HourlyData {
    time: number,
    precipitation: number,
    airTemperature: number,
    airHumidity: number,
    wind: number,
}

export type StationVar = 'precipitation' | 'airTemperature' | 'airHumidity' | 'airPressure' | 'soilTemperature' | 'soilHumidity' | 'radiation' | 'wind' | 'evapotranspiration';

export type StationVarKey = 'precipitacao' | 'evapotranspiracao';

export type Month = 'jan' | 'fev' | 'mar' | 'abr' | 'mai' | 'jul' | 'ago' | 'set' | 'out' | 'nov' | 'dez';

export type StationType = 0 | 1 | 2;

export type Period = 0 | 1 | 2 | 3;

export type TimePeriod = 'hourly' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly';

export type MapStypeType = 'streets' | 'dark' | 'satellite';