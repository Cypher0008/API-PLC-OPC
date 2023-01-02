//OPC UA
const { OPCUAClient, AttributeIds } = require('node-opcua');
const endpointURL = "opc.tcp://LAPTOP-HDHLV21D:49320";
const client = OPCUAClient.create({ endpointMustExist: false });

let sessions = {};
class OPCUA {
    async conect(req, res) {
        await client.connect(endpointURL, (err) => {
            const Matricula = req.Matricula;
            if (err) {
                console.log(`cannt connect to endpont: ${err}`)
                res.status(502).send(`cannt connect to endpont: ${err}`);
            }
            else {
                console.log('connected!!');
                client.createSession((err, session) => {
                    if (err) {
                        console.log(`cannt create a session: ${err}`)
                        res.status(502).send(`cannt create a session: ${err}`);
                        return;
                    }
                    console.log(`seção criada`);
                    sessions[Matricula] = session;
                    console.log('the_session')
                    res.status(200).send(`conectado e seção criada`);

                })
            }
        })
    };
    async disconnect(req, res) {
        const Matricula = req.Matricula;
        client.closeSession(sessions[Matricula], false).then(() => {
            client.disconnect().then(() => {
                sessions[Matricula] = null;
                console.log(`desconectado`);
                res.status(200).send(`desconectado`);
            }).catch(err => {
                console.log(`cannt disconnect: ${err}`);
                res.status(502).send(`cannt disconnect: ${err}`);
            })
        });
    };
    async readVariable(req, res) {
        const Matricula = req.Matricula;
        if (!sessions[Matricula]) {
            console.log(`desconectado`)
            res.status(502).send(`desconectado`);
            return;
        }
        await sessions[Matricula].read({ nodeId: "ns=2;s=MDB.PLC1.400100", attributeId: AttributeIds.Value }, (err, dataValue) => {
            if (!err) {
                console.log(`value: ${dataValue.value.value}`);
                res.status(200).send(`value: ${dataValue.value.value}`);
            }
        })
    }
    async motor(req, res) {
        const Matricula = req.Matricula;
        if (!sessions[Matricula]) {
            console.log(`desconectado`)
            res.status(502).send(`desconectado`);
            return;
        }
        await sessions[Matricula].read({ nodeId: "ns=2;s=MDB.PLC1.Motor", attributeId: AttributeIds.Value }, (err, dataValue) => {
            if (!err) {
                console.log(`Motor value: ${dataValue.value.value}`);
                const binValue = (dataValue.value.value>>>0).toString(2)
                res.status(200).json({
                    Ligado: (binValue[binValue.length-1]==1),
                    Defeito: (binValue[binValue.length-2]==1),
                });
            }
        })
    }
    async temperatura(req, res) {
        const Matricula = req.Matricula;
        if (!sessions[Matricula]) {
            console.log(`desconectado`)
            res.status(502).send(`desconectado`);
            return;
        }
        await sessions[Matricula].read({ nodeId: "ns=2;s=MDB.PLC1.Temperatura", attributeId: AttributeIds.Value }, (err, dataValue) => {
            if (!err) {
                console.log(`Temperatura value: ${dataValue.value.value}`);
                const ValorAlto = 90;
                const ValorBaixo = 50;
                res.status(200).json({
                    Temperatura: dataValue.value.value,
                    Alto: ValorAlto,
                    Baixo: ValorBaixo,
                    ValorAlto: (dataValue.value.value > ValorAlto),
                    ValorBaixo: (dataValue.value.value < ValorBaixo),
                });
            }
        })
    }
    async fluxo(req, res) {
        const Matricula = req.Matricula;
        if (!sessions[Matricula]) {
            console.log(`desconectado`)
            res.status(502).send(`desconectado`);
            return;
        }
        await sessions[Matricula].read({ nodeId: "ns=2;s=MDB.PLC1.Fluxo", attributeId: AttributeIds.Value }, (err, dataValue) => {
            if (!err) {
                console.log(`Fluxo value: ${dataValue.value.value}`);
                const ValorAlto = 23;
                const ValorBaixo = 17;
                res.status(200).json({
                    Fluxo: dataValue.value.value,
                    Alto: ValorAlto,
                    Baixo: ValorBaixo,
                    ValorAlto: (dataValue.value.value > ValorAlto),
                    ValorBaixo: (dataValue.value.value < ValorBaixo),
                });
            }
        })
    }
}

module.exports = new OPCUA();