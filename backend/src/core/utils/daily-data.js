const { transformByMonthly, transformByDaily } = require("./period");
const { copy } = require("./utils");

const transformDataByPeriod = (items, period) => {
    const result = copy(items);
    switch(period){
        case 'monthly':
            return transformByMonthly(result);
        default:
            return transformByDaily(result);
    }
};

module.exports = { transformDataByPeriod };