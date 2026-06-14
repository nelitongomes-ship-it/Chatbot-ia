const axios = require("axios");

// =====================================================
// CDI
// =====================================================

async function consultarCDI({
  message,
  phone,
  sendMessage
}) {

  if (
    !message.toLowerCase().includes("cdi")
  ) {
    return false;
  }

  try {

    console.log(
      "Consultando CDI..."
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

    const cdi =
      taxas.find(
        item =>
          item.nome
            .toLowerCase()
            .includes("cdi")
      );

    await sendMessage(
      phone,
      `💰 CDI atual:\n${cdi.valor}%`
    );

  } catch (error) {

    console.log(
      "ERRO CDI:",
      error.message
    );

    await sendMessage(
      phone,
      "⚠️ Não consegui consultar o CDI agora."
    );

  }

  return true;
}

module.exports = {
  consultarCDI
};
