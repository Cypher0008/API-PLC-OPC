//importar 
const opcua = require('./opcua');
const usuarios = require('./usuarios');
const token = require('./token');

module.exports = app => {
    app.post('/admin/criarUsuario', async (req, res) => {
        await token.checarToken(req,res,(req, res)=>{usuarios.creatUser(req, res); })
    });

    app.post('/login', (req, res) => {
        usuarios.login(req, res);
    });

    app.get('/logout', (req, res) => {
        usuarios.logout(req, res);
    });

    app.get('/conectar', async (req, res) => {
        await token.checarToken(req,res,(req, res)=>{opcua.conect(req, res);; })
    });

    app.get('/desconectar', async (req, res) => {
        await token.checarToken(req,res,(req, res)=>{opcua.disconnect(req, res);; })
    });

    app.get('/motor', async (req, res) => {
        await token.checarToken(req,res,(req, res)=>{opcua.motor(req, res);; })
    });

    app.get('/temperatura', async (req, res) => {
        await token.checarToken(req,res,(req, res)=>{opcua.temperatura(req, res);; })
    });

    app.get('/Fluxo', async (req, res) => {
        await token.checarToken(req,res,(req, res)=>{opcua.fluxo(req, res);; })
    });


}