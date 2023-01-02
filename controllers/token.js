const connection = require('../model/connection');
const jwt = require("jsonwebtoken");
const { json } = require('express');
const segredo = "segredo";


class Token {
    creatTokenJWT(usuario) {
        const payload = { Matricula: usuario.Matricula, userName: usuario.userName };
        console.log('payload', payload);
        const token = jwt.sign(payload, segredo, { expiresIn: "1h" });
        console.log('token', token);
        return token;
    }   

    async checarToken(req,res,next) {
        try {
            const token = req.query.token || req.body.token;
            const Matricula = req.query.token || req.body.Matricula;
            const path = req.route.path;
            console.log("token checar token:", token);
            if (!token) {
                console.log("Não autorizado");
                throw { err: true, msg: "Não autorizado" };
            }
            const userJwt = jwt.verify(token, segredo);
            console.log('userJwt', userJwt);
            req.Matricula = userJwt.Matricula;
            let userDB = [];
            const sql = `SELECT * FROM user WHERE user.Matricula = "${userJwt.Matricula}"`
            await connection.query(sql, (err, result, fields) => {
                if (err) {
                    console.log('err query', err);
                    res.status(500).send(`Error: ${err}`);
                    return;
                }
                    console.log('result', result);
                    userDB = result;
                    console.log('userDB', userDB);
                    if (!userDB.length) {
                        console.log("checarToken: Usuario não encontrado");
                        res.status(500).send(`Error: Usuario não encontrado`);
                        return;
                    }
                    const administrador = path.search("admin") != -1;
                    console.log("administrador", administrador);
                    if (administrador && !userDB[0].Adm) {
                        console.log("Usuario não é administrador");
                        res.status(500).send(`Error: Usuario não é administrador`);
                        return;
                    }
                    console.log("Válido");
                    next(req,res);
                    return;
            })

        } catch (error) {
            console.log("Inválido");
            console.log("error checarToken: ", error);
            res.status(500).json(error);
            return;
        }
    }
}

module.exports = new Token();