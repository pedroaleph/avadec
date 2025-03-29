const { getEvapotranspiration, getTotal, getMax, getMin } = require("./utils");

const transformByDaily = (items) => {
    const result = items.map(item => {
        item.time = new Date(item.data).getTime();
        item.evapotranspiracao = getEvapotranspiration(item);

        return item;
    });

    return result;
};

const transformByMonthly = (items) => {
    const months = [];
    items.forEach(item => {
        const month = item.data.slice(0, 7);
        if (!months.includes(month)) {
            months.push(month);
        }

        item.time = new Date(item.data).getTime();
        item.evapotranspiracao = getEvapotranspiration(item);
    });
    
    const result = months.map(month => {
        const itemsByMonth = items.filter(item => item.data.startsWith(month));
        const item = itemsByMonth[0];
        item.precipitacao = getTotal(itemsByMonth, 'precipitacao');
        item.evapotranspiracao = getTotal(itemsByMonth, 'evapotranspiracao');
        Object.keys(item).forEach(key => {
            if (key.toLocaleLowerCase().includes('med')) {
                item[key] = getTotal(itemsByMonth, key) / itemsByMonth.length;
            } else if (key.toLocaleLowerCase().includes('max')) {
                item[key] = getMax(itemsByMonth, key);
            } else if (key.toLocaleLowerCase().includes('min')) {
                item[key] = getMin(itemsByMonth, key);
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