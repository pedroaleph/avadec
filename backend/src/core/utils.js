const copy = (item) => {
    return JSON.parse(JSON.stringify(item));
}

const transformDataByPeriod = (data, period) => {
    const result = copy(data);
    switch(period){
        case 'monthly':
            return transformByMonthly(result);
        default:
            return transformByDaily(result);
    }
};

const transformByDaily = (data) => {
    const result = data.map(item => {
        item.time = new Date(item.data).getTime();
        item.evapotranspiracao = getEvapotranspiration(item);

        return item;
    });

    return result;
};

const transformByMonthly = (data) => {
    const values = [];
    data.forEach(item => {
        const date = new Date(item.data);
        const value = date.getFullYear() + '-' + date.getMonth();
        if (!values.includes(value)) {
            values.push(value);
        }

        item.data = date;
        item.time = date.getTime();
        item.evapotranspiracao = getEvapotranspiration(item);
    });
    
    const result = values.map(value => {
        const [year, month] = value.split('-');
        const items = data.filter(item => item.data.getFullYear() === parseInt(year) && item.data.getMonth() === parseInt(month));
        const item = items[0]
        item.precipitacao = getTotal(items, 'precipitacao');
        item.evapotranspiracao = getTotal(items, 'evapotranspiracao');
        Object.keys(item).forEach(key => {
            if (key.toLocaleLowerCase().includes('med')) {
                const length = items.length > 0 ? items.length : 1;
                item[key] = getTotal(items, key) / length;
            } else if (key.toLocaleLowerCase().includes('max')) {
                item[key] = items.reduce((max, item) => item[key] > max ? item[key] : max, item[key]);
            } else if (key.toLocaleLowerCase().includes('min')) {
                item[key] = items.reduce((min, item) => item[key] < min ? item[key] : min, item[key]);
            }
        });

        return item;
    });

    return result;
};

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
    transformDataByPeriod,
    transformByDaily,
    transformByMonthly
};