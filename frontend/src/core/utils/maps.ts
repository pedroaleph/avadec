export const stationVarLabel = new Map<string, string>()

stationVarLabel.set('precipitation', 'Precipitação');
stationVarLabel.set('airTemperature', 'Temperatura');
stationVarLabel.set('airHumidity', 'Umidade');
stationVarLabel.set('wind', 'Vento');

export const stationVarColor = new Map<string, string>()

stationVarColor.set('precipitation', '#7798D3');
stationVarColor.set('airTemperature', 'rgb(255, 63, 0)');
stationVarColor.set('airHumidity', '#cbbe23');
stationVarColor.set('wind', '#f7caac');

export const stationVarLimits = new Map<string, number[]>()

stationVarLimits.set('precipitation', [0, 400]);
stationVarLimits.set('airTemperature', [-5, 50]);
stationVarLimits.set('airHumidity', [0, 100]);
stationVarLimits.set('wind', [0, 130]);

export const stationVarUnit = new Map<string, string>();

stationVarUnit.set('precipitation', 'mm');
stationVarUnit.set('airTemperature', '°C');
stationVarUnit.set('airHumidity', '%');
stationVarUnit.set('wind', 'km/h');