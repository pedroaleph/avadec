const { Router } = require("express");
const routes = Router();
const controller = require('./controller');

routes.get('/stations', controller.getStations);
routes.get('/stations/:id', controller.getOneStation);
routes.get('/daily-data/:id', controller.getDailyData);

module.exports = routes;