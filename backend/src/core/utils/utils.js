const copy = (item) => {
    return JSON.parse(JSON.stringify(item));
}

const getTotal = (items, key) => {
    return items.reduce((total, item) => total + item[key], 0);
};

const getMax = (items, key) => {
    return items.reduce((max, item) => item[key] > max ? item[key] : max, items[0][key]);
};

const getMin = (items, key) => {
    return items.reduce((min, item) => item[key] < min ? item[key] : min, items[0][key]);
};

const getEvapotranspiration = (item) => {
    const { mediaUv, temperaturaArMedia, umidadeArMedia, ventoMedia, pressaoArMedia } = item;
    const pressao = pressaoArMedia * 0.1;
    const vento = ventoMedia / 3.6;
    const Rs =  mediaUv * 0.4;
    const Rn = Rs * 0.75;
    const eS = 0.6108 * Math.exp(((17.27 * temperaturaArMedia) / (temperaturaArMedia + 237.3)));
    const eA = eS * (umidadeArMedia / 100);
    const delta = (4098 * eS) / Math.pow(temperaturaArMedia + 237.3, 2);
    const G = 0;
    const gamma = 0.0665 * pressao;

    const ETn = 0.408 * delta * (Rn - G) + gamma * (900 / (temperaturaArMedia + 273)) * vento * (eS - eA);
    const ETd = delta + gamma * (1 + 0.34 * vento);
    const ET = ETn / ETd;

    return ET;
};

module.exports = {
    copy,
    getTotal,
    getMax,
    getMin,
    getEvapotranspiration
};