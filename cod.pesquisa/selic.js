const axios = require("axios");

// =====================================================
// SELIC
// =====================================================

async function consultarSelic({
  message,
  phone,
  sendMessage
}) {

  if (
    !message.toLowerCase().includes("selic")
  ) {
    return false;
  }

  try {

    console.log(
      "Consultando Selic..."
    );

    const response =
      await axios.get(
        "https://brasilapi.com.br/api/taxas/v1",
        {
          timeout: 10000
        }
      );

    const taxas =
      response.data;

    const selic =
      taxas.find(
        item =>
          item.nome
            .toLowerCase()
            .includes("selic")
      );

    await sendMessage(
      phone,
      `📈 Taxa Selic atual:\n${selic.valor}%`
    );

  } catch (error) {

    console.log(
      "ERRO SELIC:",
      error.message
    );

    await sendMessage(
      phone,
      "⚠️ Não consegui consultar a Selic agora."
    );

  }

  return true;
}

module.exports = {
  consultarSelic
};
