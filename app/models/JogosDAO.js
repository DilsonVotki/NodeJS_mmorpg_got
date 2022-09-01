function JogosDAO(connection) {
  this._connection = connection;
}

JogosDAO.prototype.gerarParametros = function (usuario, res) {
  var dados = {
    operacao: "inserirJogo",
    jogo: {
      usuario: usuario,
      moeda: 15,
      suditos: 10,
      temor: Math.floor(Math.random() * 1000),
      sabedoria: Math.floor(Math.random() * 1000),
      comercio: Math.floor(Math.random() * 1000),
      magia: Math.floor(Math.random() * 1000),
    },
    collection: "jogo",
    callback: function (err, result) {
      res.send("Inserindo jogo");
    },
  };
  this._connection(dados);
};

JogosDAO.prototype.iniciaJogo = function (res, user, msg) {
  var usuario = {
    usuario: user.usuario,
  };

  var dados = {
    operacao: "consultaJogo",
    usuario,
    collection: "jogo",
    callback: function (err, result) {
      result.toArray(function (errArray, resultArray) {
        res.render("jogo", {
          img_casa: resultArray[0].usuario.casa,
          jogo: resultArray[0],
          msg: msg,
        });
      });
    },
  };
  this._connection(dados);
};

JogosDAO.prototype.acao = function (acao, res) {
  var date = new Date();
  var tempo = null;

  switch (parseInt(acao.acao)) {
    case 1:
      tempo = 1 * 60 * 60000;
      break;
    case 2:
      tempo = 2 * 60 * 60000;
      break;
    case 3:
      tempo = 5 * 60 * 60000;
      break;
    case 4:
      tempo = 5 * 60 * 60000;
      break;
  }
  acao.acao_termina_em = date.getTime() + tempo;

  var dados = {
    operacao: "inserirJogo",
    jogo: acao,
    collection: "acao",
    callback: function (err, result) {
      // res.send("Inserindo acao");
    },
  };
  this._connection(dados);

  var moedas = null;

  switch (parseInt(acao.acao)) {
    case 1:
      moedas = -2 * acao.quantidade;
      break;
    case 2:
      moedas = -3 * acao.quantidade;
      break;
    case 3:
      moedas = -1 * acao.quantidade;
      break;
    case 4:
      moedas = -1 * acao.quantidade;
      break;
  }

  var usuario = {
    usuario: acao.usuario,
  };

  var dadosUpdate = {
    operacao: "updateMoeda",
    usuario,
    moeda: moedas,
    collection: "jogo",
    callback: function (err, result) {
      // res.send("Inserindo acao");
    },
  };
  this._connection(dadosUpdate);
};

JogosDAO.prototype.getAcoes = function (res, user) {
  var usuario = {
    usuario: user.usuario,
  };

  var date = new Date();
  var momento_atual = date.getTime();

  var dados = {
    operacao: "consultaAcao",
    usuario,
    acao_termina_em: { $gt: momento_atual },
    collection: "acao",
    callback: function (err, result) {
      result.toArray(function (errArray, resultArray) {
        res.render("pergaminhos", { acoes: resultArray });
      });
    },
  };
  this._connection(dados);
};

module.exports = function () {
  return JogosDAO;
};
