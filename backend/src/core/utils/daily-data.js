const { transformByMonthly, transformByDaily } = require("./period");
const { copy } = require("./utils");

const transformDataByPeriod = (data, period) => {
    const result = copy(data);
    switch(period){
        case 'monthly':
            return transformByMonthly(result);
        default:
            return transformByDaily(result);
    }
};

module.exports = { transformDataByPeriod };