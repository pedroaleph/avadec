const { getEvapotranspiration, getTotal } = require("./utils");

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
        const item = items[0];
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

module.exports = {
    transformByDaily,
    transformByMonthly
};