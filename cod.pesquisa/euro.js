const axios = require("axios");

// =====================================================
// COTAÇÃO EURO
// =====================================================

async function consultarEuro({
  message,
  phone,
  sendMessage
}) {

  if (
    !message.toLowerCase().includes("euro")
  ) {
    return false;
  }

  try {

    console.log(
      "Consultando euro..."
    );

    const response =
      await axios.get(
        "https://economia.awesomeapi.com.br/json/last/EUR-BRL",
        {
          timeout: 10000
        }
      );

    console.log(
      response.data
    );

    const valor =
      response.data?.EURBRL?.bid;

    await sendMessage(
      phone,
      `💶 Euro atual:\nR$ ${valor}`
    );

  } catch (error) {

    console.log(
      "ERRO EURO:",
      error.message
    );

    await sendMessage(
      phone,
      "⚠️ Não consegui consultar o euro agora."
    );
  }

  return true;
}

module.exports = {
  consultarEuro
};
