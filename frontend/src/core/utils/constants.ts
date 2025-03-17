import { StationVar, StationVarKey } from "./models";

export const months = [
    "JAN",
    "FEV",
    "MAR",
    "ABR",
    "MAI",
    "JUN",
    "JUL",
    "AGO",
    "SET",
    "OUT",
    "NOV",
    "DEZ",
];

export const fullMonths = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
];

export const stationVarDict = {
    precipitation: {
        label: "Precipitação",
        limits: [0, 500],
        unit: 'mm',
        keys: [
            {
                name: 'precipitacao',
                label: 'Precipitação',
                color: '#7798D3'
            }
        ]
    },
    airTemperature: {
        label: "Temperatura do ar",
        limits: [-15, 60],
        unit: '°C',
        keys: [
            {
                name: 'temperaturaArMaxima',
                label: 'Máxima',
                color: '#B34A4A'
            },
            {
                name: 'temperaturaArMedia',
                label: 'Média',
                color: '#D37777'
            },
            {
                name: 'temperaturaArMinima',
                label: 'Mínima',
                color: '#E69595'
            },
        ]
    },
    airHumidity: {
        label: "Umidade do ar",
        limits: [5, 100],
        unit: '%',
        keys: [
            {
                name: 'umidadeArMaxima',
                label: 'Máxima',
                color: '#4AB380'
            },
            {
                name: 'umidadeArMedia',
                label: 'Média',
                color: '#77D3A2'
            },
            {
                name: 'umidadeArMinima',
                label: 'Mínima',
                color: '#95E6C2'
            }
        ]
    },
    airPressure: {
        label: "Pressão do ar",
        limits: [900, 1100],
        unit: "hPa",
        keys: [
            {
                name: 'pressaoArMaxima',
                label: 'Máxima',
                color: '#B39F4A'
            },
            {
                name: 'pressaoArMedia',
                label: 'Média',
                color: '#D3C877'
            },
            {
                name: 'pressaoArMinima',
                label: 'Mínima',
                color: '#E6D895'
            }
        ]
    },
    soilTemperature: {
        label: "Temperatura do solo",
        limits: [-15, 60],
        unit: '°C',
        keys: [
            {
                name: 'temperaturaSoloMaxima',
                label: 'Máxima',
                color: '#B34A9F'
            },
            {
                name: 'temperaturaSoloMedia',
                label: 'Média',
                color: '#D377C8'
            },
            {
                name: 'temperaturaSoloMinima',
                label: 'Mínima',
                color: '#E695D6'
            }
        ]
    },
    soilHumidity: {
        label: "Umidade do solo",
        limits: [5, 100],
        unit: '%',
        keys: [
            {
                name: 'umidadeSoloMaxima',
                label: 'Máxima',
                color: '#4AB3B3'
            },
            {
                name: 'umidadeSoloMedia',
                label: 'Média',
                color: '#77D3D3'
            },
            {
                name: 'umidadeSoloMinima',
                label: 'Mínima',
                color: '#95E6E6'
            }
        ]
    },
    radiaion: {
        label: "Nível UV",
        limits: [0, 4000],
        unit: "mW/cm²",
        keys: [
            {
                name: 'maxUv',
                label: 'Máxima',
                color: '#B3664A'
            },
            {
                name: 'mediaUv',
                label: 'Média',
                color: '#D38C77'
            },
            {
                name: 'minUv',
                label: 'Mínima',
                color: '#E6BFA6'
            }
        ]
    },
    wind: {
        label: "Vento",
        limits: [0, 130],
        unit: 'km/h',
        keys: [
            {
                name: 'ventoMaxima',
                label: 'Máxima',
                color: '#4A4AB3'
            },
            {
                name: 'ventoMedia',
                label: 'Média',
                color: '#7777D3'
            },
            {
                name: 'ventoMinima',
                label: 'Mínima',
                color: '#9595E6'
            }
        ]
    },
    evapotranspiration: {
        label: "Evapotranspiração",
        limits: [0, 100],
        unit: 'mm',
        keys: [
            {
                name: 'evapotranspiracao',
                label: 'Evapotranspiração',
                color: '#4DB3B3'
            }
        ]
    }
}

export const stationVariables: StationVar[] = [
    'precipitation',
    'airTemperature',
    'airHumidity',
    'airPressure',
    'soilTemperature',
    'soilHumidity',
    'radiaion',
    'wind',
    'evapotranspiration'
];

export const cumulativeStationVars: StationVar[] = ['precipitation', 'evapotranspiration'];

export const stationVarKey: { [key: string]: StationVarKey } = {
    precipitation: 'precipitacao',
    evapotranspiration: 'evapotranspiracao'
}