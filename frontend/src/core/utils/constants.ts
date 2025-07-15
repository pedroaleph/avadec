import { StationVar, StationVarKey } from './models';

export const months = [
    'JAN',
    'FEV',
    'MAR',
    'ABR',
    'MAI',
    'JUN',
    'JUL',
    'AGO',
    'SET',
    'OUT',
    'NOV',
    'DEZ',
];

export const fullMonths = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
];

export const stationVarDict = {
    precipitation: {
        label: 'Precipitação',
        limits: [0, 500],
        reference: {
            min: 0,
            max: 100,
        },
        yticks: [0, 100, 300, 500],
        unit: 'mm',
        color: '#7798D3',
        keys: [
            {
                name: 'precipitacao',
                label: 'Precipitação',
                color: '#7798D3',
                isDisplayed: true,
                strokeDasharray: undefined,
            },
        ],
    },
    airTemperature: {
        label: 'Temperatura do ar',
        limits: [-15, 60],
        reference: {
            min: 10,
            max: 35,
        },
        yticks: [-15, 10, 35, 60],
        unit: '°C',
        color: '#D55E00',
        keys: [
            {
                name: 'temperaturaArMaxima',
                label: 'Máxima',
                color: '#B34A4A',
                isDisplayed: true,
                strokeDasharray: '5 5',
            },
            {
                name: 'temperaturaArMedia',
                label: 'Média',
                color: '#D37777',
                isDisplayed: true,
                strokeDasharray: undefined,
            },
            {
                name: 'temperaturaArMinima',
                label: 'Mínima',
                color: '#E69595',
                isDisplayed: true,
                strokeDasharray: '2 5',
            },
        ],
    },
    airHumidity: {
        label: 'Umidade do ar',
        limits: [5, 100],
        reference: {
            min: 40,
            max: 80,
        },
        yticks: [5, 40, 55, 80, 100],
        unit: '%',
        color: '#009E73',
        keys: [
            {
                name: 'umidadeArMaxima',
                label: 'Máxima',
                color: '#4AB380',
                isDisplayed: true,
                strokeDasharray: '5 5',
            },
            {
                name: 'umidadeArMedia',
                label: 'Média',
                color: '#77D3A2',
                isDisplayed: true,
                strokeDasharray: undefined,
            },
            {
                name: 'umidadeArMinima',
                label: 'Mínima',
                color: '#95E6C2',
                isDisplayed: true,
                strokeDasharray: '2 5',
            },
        ],
    },
    airPressure: {
        label: 'Pressão do ar',
        limits: [900, 1100],
        reference: {
            min: 1000,
            max: 1030,
        },
        yticks: [900, 950, 1000, 1030, 1100],
        unit: 'hPa',
        color: '#C49C00',
        keys: [
            {
                name: 'pressaoArMaxima',
                label: 'Máxima',
                color: '#B39F4A',
                isDisplayed: true,
                strokeDasharray: '5 5',
            },
            {
                name: 'pressaoArMedia',
                label: 'Média',
                color: '#D3C877',
                isDisplayed: true,
                strokeDasharray: undefined,
            },
            {
                name: 'pressaoArMinima',
                label: 'Mínima',
                color: '#E6D895',
                isDisplayed: true,
                strokeDasharray: '2 5',
            },
        ],
    },
    soilTemperature: {
        label: 'Temperatura do solo',
        limits: [-15, 60],
        reference: {
            min: 15,
            max: 35,
        },
        yticks: [-15, 15, 35, 60],
        unit: '°C',
        color: '#CC79A7',
        keys: [
            {
                name: 'temperaturaSoloMaxima',
                label: 'Máxima',
                color: '#B34A9F',
                isDisplayed: true,
                strokeDasharray: '5 5',
            },
            {
                name: 'temperaturaSoloMedia',
                label: 'Média',
                color: '#D377C8',
                isDisplayed: true,
                strokeDasharray: undefined,
            },
            {
                name: 'temperaturaSoloMinima',
                label: 'Mínima',
                color: '#E695D6',
                isDisplayed: true,
                strokeDasharray: '2 5',
            },
        ],
    },
    soilHumidity: {
        label: 'Umidade do solo',
        limits: [5, 100],
        reference: {
            min: 50,
            max: 80,
        },
        yticks: [5, 30, 50, 80, 100],
        unit: '%',
        color: '#56B4E9',
        keys: [
            {
                name: 'umidadeSoloMaxima',
                label: 'Máxima',
                color: '#4AB3B3',
                isDisplayed: true,
                strokeDasharray: '5 5',
            },
            {
                name: 'umidadeSoloMedia',
                label: 'Média',
                color: '#77D3D3',
                isDisplayed: true,
                strokeDasharray: undefined,
            },
            {
                name: 'umidadeSoloMinima',
                label: 'Mínima',
                color: '#95E6E6',
                isDisplayed: true,
                strokeDasharray: '2 5',
            },
        ],
    },
    radiation: {
        label: 'Nível UV',
        limits: [0, 4000],
        reference: {
            min: 1000,
            max: 3000,
        },
        yticks: [0, 1000, 2000, 3000, 4000],
        unit: 'mW/cm²',
        color: '#E69F00',
        keys: [
            {
                name: 'maxUv',
                label: 'Máxima',
                color: '#B3664A',
                isDisplayed: true,
                strokeDasharray: '5 5',
            },
            {
                name: 'mediaUv',
                label: 'Média',
                color: '#D38C77',
                isDisplayed: true,
                strokeDasharray: undefined,
            },
            {
                name: 'minUv',
                label: 'Mínima',
                color: '#E6BFA6',
                isDisplayed: true,
                strokeDasharray: '2 5',
            },
        ],
    },
    wind: {
        label: 'Vento',
        limits: [0, 130],
        reference: {
            min: 5,
            max: 40,
        },
        yticks: [0, 5, 35, 40, 70, 130],
        unit: 'km/h',
        color: '#0072B2',
        keys: [
            {
                name: 'ventoMaxima',
                label: 'Máxima',
                color: '#4A4AB3',
                isDisplayed: true,
                strokeDasharray: '5 5',
            },
            {
                name: 'ventoMedia',
                label: 'Média',
                color: '#7777D3',
                isDisplayed: true,
                strokeDasharray: undefined,
            },
            {
                name: 'ventoMinima',
                label: 'Mínima',
                color: '#9595E6',
                isDisplayed: true,
                strokeDasharray: '2 5',
            },
        ],
    },
    evapotranspiration: {
        label: 'Evapotranspiração',
        limits: [0, 100],
        reference: {
            min: 0,
            max: 8,
        },
        yticks: [0, 8, 25, 50, 75, 100],
        unit: 'mm',
        color: '#999999',
        keys: [
            {
                name: 'evapotranspiracao',
                label: 'Evapotranspiração',
                color: '#4DB3B3',
                isDisplayed: true,
                strokeDasharray: undefined,
            },
        ],
    },
};


export const stationVariables: StationVar[] = [
    'precipitation',
    'airTemperature',
    'airHumidity',
    'airPressure',
    'soilTemperature',
    'soilHumidity',
    'radiation',
    'wind',
    'evapotranspiration',
];

export const cumulativeStationVars: StationVar[] = ['precipitation', 'evapotranspiration'];

export const stationVarKey: { [key: string]: StationVarKey } = {
    precipitation: 'precipitacao',
    evapotranspiration: 'evapotranspiracao',
}