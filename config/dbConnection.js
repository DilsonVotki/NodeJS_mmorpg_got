var mongo = require("mongodb").MongoClient;
var assert = require("assert");
const url = "mongodb://localhost:27017";
const dbName = "got";

var connMongoDB = function (dados) {
  mongo.connect(url, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    query(db, dados);
    client.close();
  });
};

function query(db, dados) {
  var collection = db.collection(dados.collection);
  switch (dados.operacao) {
    case "inserir":
      collection.insertOne(dados.usuario, dados.callback);
      break;
    case "inserirJogo":
      collection.insertOne(dados.jogo, dados.callback);
      break;
    case "consultar":
      collection.find(dados.usuario, dados.callback);
      break;
    case "consultaJogo":
      collection.find(
        { "usuario.usuario": dados.usuario.usuario },
        dados.callback
      );
      break;
    case "consultaAcao":
      collection.find(
        {
          usuario: dados.usuario.usuario,
          acao_termina_em: dados.acao_termina_em,
        },
        dados.callback
      );
      break;
    case "updateMoeda":
      collection.updateOne(
        { "usuario.usuario": dados.usuario.usuario },
        { $inc: { moeda: dados.moeda } },
        dados.callback
      );
      break;
    default:
      break;
  }
}

module.exports = function () {
  return connMongoDB;
};
