module.exports.jogo = function (application, req, res) {
  if (req.session.autorizado !== true) {
    res.send("Usuário precisa logar!");
    return;
  }

  var msg = "";

  if (req.query.msg != "") {
    msg = req.query.msg;
  }

  var usuario = req.session;

  var connection = application.config.dbConnection;
  var JogosDAO = new application.app.models.JogosDAO(connection);

  JogosDAO.iniciaJogo(res, usuario, msg);
};

module.exports.sair = function (application, req, res) {
  req.session.destroy(function (err) {
    res.render("index", { validacao: {} });
  });
};

module.exports.suditos = function (application, req, res) {
  if (req.session.autorizado !== true) {
    res.send("Usuário precisa logar!");
    return;
  }

  res.render("aldeoes", { validacao: {} });
};

module.exports.pergaminhos = function (application, req, res) {
  if (req.session.autorizado !== true) {
    res.send("Usuário precisa logar!");
    return;
  }
  var usuario = req.session;
  var connection = application.config.dbConnection;
  var JogosDAO = new application.app.models.JogosDAO(connection);

  JogosDAO.getAcoes(res, usuario);
};

module.exports.ordenar_acao_sudito = function (application, req, res) {
  if (req.session.autorizado !== true) {
    res.send("Usuário precisa logar!");
    return;
  }

  var dadosForm = req.body;

  req.assert("acao", "Ação deve ser informada").notEmpty();
  req.assert("quantidade", "Quantidade deve ser informada").notEmpty();

  var erros = req.validationErrors();
  if (erros) {
    res.redirect("jogo?msg=A");
    return;
  }

  var connection = application.config.dbConnection;
  var JogosDAO = new application.app.models.JogosDAO(connection);

  dadosForm.usuario = req.session.usuario;
  JogosDAO.acao(dadosForm, res);

  res.redirect("jogo?msg=B");
};
