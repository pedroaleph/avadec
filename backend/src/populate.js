const { MongoClient } = require('mongodb');
const municipios = require('../municipios.json');
const estacoes = require("../estacoes.json")

const diferencaDeDias = (dataA, dataB) => {
    const milissegundos = Math.abs(dataA - dataB);
    return Math.floor(milissegundos / (1000 * 60 * 60 * 24));
};

const hoje = new Date();
const umAnoAtras = new Date(
    hoje.getFullYear() - 1,
    hoje.getMonth(),
    hoje.getDate(),
);
const dias = diferencaDeDias(hoje, umAnoAtras);
const datas = Array.from(
    { length: dias },
    (_, index) =>
        new Date(
            umAnoAtras.getFullYear(),
            umAnoAtras.getMonth(),
            umAnoAtras.getDate() + index + 1,
        )
);

const estacoesPorMunicipio = () => municipios.reduce(
    (estacoes, municipio, indice_minicipio) => {
        municipio.estacoes.forEach((estacao, index) => {
            estacao.modulo_id = indice_minicipio * 3 + index + 1;
            estacao.nome_modulo = estacao.nome;
            estacao.municipio = municipio.nome;
            delete estacao.nome;
            estacao.dataIni = umAnoAtras;
            estacao.data = new Date(
                hoje.getFullYear(),
                hoje.getMonth(),
                hoje.getDate() - 1,
            );
            estacao.online = 1;
        });

        return estacoes.concat(municipio.estacoes);
    },
    []
);

estacoes.forEach((estacao, index) => {
    estacao.modulo_id = index + 1;
    estacao.nome_modulo = estacao.nome;
    delete estacao.nome;
    estacao.dataIni = umAnoAtras;
    estacao.data = new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        hoje.getDate() - 1,
    );
    estacao.online = 1;
});

const limites = {
    temperatura: {
        min: -15,
        max: 60,
    },
    umidade: {
        min: 5,
        max: 100,
    },
    precipitacao: {
        min: 0,
        max: 500,
    },
    pressao: {
        min: 900,
        max: 1100,
    },
    vento: {
        min: 0,
        max: 130,
    },
    radiacao: {
        min: 0,
        max: 4000,
    },
};

const valorAleatorio = (min, max) => {
    return Math.random() * (max - min) + min;
};

const dadosDiarios = estacoes.reduce((dados, estacao) => {
    const dadosDaEstacao = datas.map(data => {
        const item = {};
        
        const precipitacao = limites.precipitacao;
        item.precipitacao = valorAleatorio(precipitacao.min, precipitacao.max);
        
        const pressao = limites.pressao;
        item.pressaoArMedia = valorAleatorio(pressao.min, pressao.max);
        item.pressaoArMaxima = valorAleatorio(item.pressaoArMedia, pressao.max);
        item.pressaoArMinima = valorAleatorio(pressao.min, item.pressaoArMedia);

        const temperatura = limites.temperatura;
        item.temperaturaArMedia = valorAleatorio(temperatura.min, temperatura.max);
        item.temperaturaArMaxima = valorAleatorio(item.temperaturaArMedia, temperatura.max);
        item.temperaturaArMinima = valorAleatorio(temperatura.min, item.temperaturaArMedia);
        item.temperaturaSoloMedia = valorAleatorio(temperatura.min, temperatura.max);
        item.temperaturaSoloMaxima = valorAleatorio(item.temperaturaSoloMedia, temperatura.max);
        item.temperaturaSoloMinima = valorAleatorio(temperatura.min, item.temperaturaSoloMedia);

        const umidade = limites.umidade;
        item.umidadeArMedia = valorAleatorio(umidade.min, umidade.max);
        item.umidadeArMaxima = valorAleatorio( item.umidadeArMedia, umidade.max);
        item.umidadeArMinima = valorAleatorio(umidade.min,  item.umidadeArMedia);
        item.umidadeSoloMedia = valorAleatorio(umidade.min, umidade.max);
        item.umidadeSoloMaxima = valorAleatorio(item.umidadeSoloMedia, umidade.max);
        item.umidadeSoloMinima = valorAleatorio(umidade.min, item.umidadeSoloMedia);

        const vento = limites.vento;
        item.ventoMedia = valorAleatorio(vento.min, vento.max);
        item.ventoMaxima = valorAleatorio(item.ventoMedia, vento.max);
        item.ventoMinima = valorAleatorio(vento.min, item.ventoMedia);

        const radiacao = limites.radiacao;
        item.mediaUv = valorAleatorio(radiacao.min, radiacao.max);
        item.maxUv = valorAleatorio(item.mediaUv, radiacao.max);
        item.minUv = valorAleatorio(radiacao.min, item.mediaUv);
        

        item.data = data;
        item.modulo_id = estacao.modulo_id;

        return item;
    });

    return dados.concat(dadosDaEstacao);
}, []);

const connection = process.env.MONGODB_CONNECTION_TEST ?? 'mongodb://localhost:27017/teste';

const uploadToMongo = async () => {
    try {
        const client = new MongoClient(connection);
        await client.connect();

        await client.db().collection('estacao').drop();
        await client.db().collection('dadosDiarios').drop();

        await client.db().collection('estacao').insertMany(estacoes);
        await client.db().collection('dadosDiarios').insertMany(dadosDiarios);

        await client.close();
    } catch (error) {
        console.error(error);
    }
};

uploadToMongo();
