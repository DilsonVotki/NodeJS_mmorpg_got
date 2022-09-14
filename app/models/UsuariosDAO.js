var crypto = require("crypto");

function UsuariosDAO(connection) {
  this._connection = connection;
}

UsuariosDAO.prototype.inserirUsuario = function (usuario, res) {
  var senha_criptografada = crypto
    .createHash("md5")
    .update(usuario.senha)
    .digest("hex");
  usuario.senha = senha_criptografada;
  var dados = {
    operacao: "inserir",
    usuario: usuario,
    collection: "usuarios",
    callback: function (err, result) {},
  };
  this._connection(dados);
};

UsuariosDAO.prototype.autenticar = function (usuario, req, res) {
  var senha_criptografada = crypto
    .createHash("md5")
    .update(usuario.senha)
    .digest("hex");
  usuario.senha = senha_criptografada;
  var dados = {
    operacao: "consultar",
    usuario: usuario,
    collection: "usuarios",
    callback: function (err, result) {
      result.toArray(function (errArray, resultArray) {
        if (resultArray[0] != undefined) {
          req.session.autorizado = true;
          req.session.usuario = resultArray[0].usuario;
          req.session.casa = resultArray[0].casa;
        } else {
          req.session.autorizado = false;
        }

        if (req.session.autorizado) {
          res.redirect("jogo");
        } else {
          res.render("index", {
            validacao: [{ msg: "Usuario não encontrado!" }],
          });
        }
      });
    },
  };
  this._connection(dados);
};

module.exports = function () {
  return UsuariosDAO;
};
