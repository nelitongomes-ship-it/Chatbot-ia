const modo1 = require("../modo1");
const modo2 = require("../modo2");
const modo3 = require("../modo3");
const modo4 = require("../modo4");
const modo5 = require("../modo5");
const modo6 = require("../modo6");
const modo7 = require("../modo7");
const modo8 = require("../modo8");

module.exports = async function carregarContexto({
  prisma,
  phone
}) {

  const cliente =
    await prisma.client.findFirst({
      where: {
        phone
      }
    });

  let contextoSistema = modo1;

  if (cliente?.aiMode === "BASICO") {
    contextoSistema = modo2;
  }

  if (cliente?.aiMode === "INTERMEDIARIO") {
    contextoSistema = modo3;
  }

  if (cliente?.aiMode === "AGILS_CRED") {
    contextoSistema = modo4;
  }

  if (cliente?.aiMode === "AVANCADO") {
    contextoSistema = modo5;
  }

  if (cliente?.aiMode === "TESTE_GRATIS") {
    contextoSistema = modo6;
  }

  if (
    cliente?.aiMode ===
    "AGUARDANDO_DADOS_TESTE"
  ) {
    contextoSistema = modo7;
  }

  if (
    cliente?.aiMode ===
    "PAGAMENTO_PENDENTE"
  ) {
    contextoSistema = modo8;
  }

  return {
    cliente,
    contextoSistema
  };
};
