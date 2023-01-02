const connection = require('../model/connection')
const bcrypt = require("bcryptjs");
const token = require('./token');

class Usuario {
  creatUser(req, res) {
    try {
      console.log("creatUser");
      const sql = 'INSERT INTO User SET ?'
      const user = {
        Matricula: req.body.Matricula,
        userName: req.body.userName,
        password: bcrypt.hashSync(req.body.password,12)
      }
      connection.query(sql, user, (err, result) => err ? res.status(400).send(err) : res.status(200).send(result))
      console.log("body creatUser");
    } catch (error) {
      console.log("error on creat user");
      res.status(500).send("error on creat user");
      return;
    }

  }
  login(req, res) {
    try {
      const userSenha = req.body.password
      const sql = `SELECT password,Matricula,userName FROM user WHERE user.Matricula = "${req.body.Matricula}"`
      connection.query(sql, (err, result, fields) => {
        if (err) {
          res.status(400).send(err)
        }
        try {
          console.log("Comparar Sennhas")
          const senhaValida = bcrypt.compareSync(
            userSenha,
            result[0].password
          );
          
          if (senhaValida) {

            req.body.userName = result[0].userName;
            console.log('result[0].userName',result[0].userName);
            const getToken = token.creatTokenJWT(req.body);
            res.cookie("token", getToken);
            res.cookie("Matricula", req.body.Matricula);
            console.log('login successful');
            res
              .status(200)
              .json({ token: getToken, KeyUser: result[0].KeyUser, nome: result[0].userName });
          } else {
            console.log("wrong password");
            res.status(400).send({ error: 'error on login' })
          }
        } catch (error) {
          console.log("error on login");
          res.status(500).send("error on login");
          return;
        }
      })
    } catch (error) {
      console.log("error on login");
      res.status(500).send("error on login");
      return;
    }
  }
  logout(req, res) {
    const token = req.query.token || req.body.token;
    if (token) {
      res.clearCookie("token");
      res.clearCookie("Matricula");
      res.status(204).send("logout realizado");
      console.log("logout realizado");
      return;
    } else {
      res.status(401).send("logout não autorizado");
      console.log("logout não autorizado");
      return;
    }
  }

}
module.exports = new Usuario();
