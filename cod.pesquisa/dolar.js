
const axios = require("axios");

async function buscarDolar() {

  const response =
    await axios.get(
      "https://economia.awesomeapi.com.br/json/last/USD-BRL"
    );

  return {
    compra:
      response.data.USDBRL.bid,
    venda:
      response.data.USDBRL.ask
  };
}

module.exports = {
  buscarDolar
};
