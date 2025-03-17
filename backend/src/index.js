const express = require("express");
const cors = require('cors');
const routes = require("./core/routes");
const dataSource = require("./core/data-source");

const corsOriginList = process.env.CORS_ORIGIN_LIST || 'http://localhost:3000';
const corsOptions = {
    origin: corsOriginList.split(','),
    optionSuccessStatus: 200,
};

const main = express();

main.use(cors(corsOptions));
main.use(express.json());
main.use(routes);

const port = process.env.PORT ?? 5000;

dataSource.connect().then(() => {
    console.log('Conexão com o banco de dados foi bem sucedida!');
    main.listen(port, () => {
        console.log('Servidor iniciado...');
    });
}).catch(() => {
    console.log('Não foi possivel se conectar ao banco de dados.');
});

