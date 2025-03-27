const copy = (item) => {
    return JSON.parse(JSON.stringify(item));
}

const getTotal = (items, key) => {
    return items.reduce((total, item) => total + item[key], 0);
};

const getEvapotranspiration = (item) => {
    const { mediaUv, temperaturaArMedia, umidadeArMedia, ventoMedia } = item;
    const Rs =  mediaUv * 0.0864;
    const Rn = Rs * 0.77;
    const Es = 0.6108 * Math.exp(((17.27 * temperaturaArMedia) / (temperaturaArMedia + 237.3)));
    const Ea = Es * (umidadeArMedia / 100);
    const D = (4098 * Es) / Math.pow(temperaturaArMedia + 237.3, 2);
    const G = 0;
    const r = 0.067;

    const ETn = 0.408 * D * (Rn - G) + r * (900 / (temperaturaArMedia + 237.3)) * ventoMedia * (Es - Ea);
    const ETd = D + r * (1 + 0.34 * ventoMedia);
    const ET = ETn / ETd;

    return ET;
};

module.exports = {
    copy,
    getTotal,
    getEvapotranspiration
};