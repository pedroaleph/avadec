const stationPipeline = [
    {
        $lookup: {
            from: "dadosdiariosestacaos",
            let: { modulo_id: "$modulo_id" },
            pipeline: [
                {
                    $match: {
                        $expr: { $eq: ["$modulo_id", "$$modulo_id"] }
                    }
                },
                {
                    $sort: { data: 1 }
                },
                {
                    $group: {
                        _id: null,
                        inicio: { $first: "$$ROOT" },
                        termino: { $last: "$$ROOT" }
                    }
                }
            ],
            as: "dadosDiarios"
        }
    },
    {
        $unwind: "$dadosDiarios"
    },
    {
        $addFields: {
            inicio: "$dadosDiarios.inicio.data",
            termino: "$dadosDiarios.termino.data"
        }
    },
    {
        $project: {
            dadosDiarios: 0
        }
    }
];

module.exports = { stationPipeline };