const axios = require("axios");

// =====================================================
// BITCOIN
// =====================================================

async function consultarBitcoin({
  message,
  phone,
  sendMessage
}) {

  if (
    !message.toLowerCase().includes("bitcoin")
  ) {
    return false;
  }

  try {

    console.log(
      "Consultando Bitcoin..."
    );

    const response =
      await axios.get(
        "https://economia.awesomeapi.com.br/json/last/BTC-BRL",
        {
          timeout: 10000
        }
      );

    const valor =
      response.data?.BTCBRL?.bid;

    await sendMessage(
      phone,
      `🪙 Bitcoin atual:\nR$ ${valor}`
    );

  } catch (error) {

    console.log(
      "ERRO BITCOIN:",
      error.message
    );

    await sendMessage(
      phone,
      "⚠️ Não consegui consultar o Bitcoin agora."
    );
  }

  return true;
}

module.exports = {
  consultarBitcoin
};
