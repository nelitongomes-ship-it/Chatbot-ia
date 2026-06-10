
const axios = require("axios");

// =====================================================
// COTAÇÃO DO DÓLAR
// Fonte:
// https://economia.awesomeapi.com.br/json/last/USD-BRL
// =====================================================

async function buscarDolar() {

  try {

    const response =
      await axios.get(
        "https://economia.awesomeapi.com.br/json/last/USD-BRL",
        {
          timeout: 10000
        }
      );

    const dolar =
      response.data.USDBRL;

    return {

      compra: Number(dolar.bid)
        .toFixed(2)
        .replace(".", ","),

      venda: Number(dolar.ask)
        .toFixed(2)
        .replace(".", ","),

      maxima: Number(dolar.high)
        .toFixed(2)
        .replace(".", ","),

      minima: Number(dolar.low)
        .toFixed(2)
        .replace(".", ","),

      variacao: Number(dolar.pctChange)
        .toFixed(2)
        .replace(".", ",")

    };

  } catch (error) {

    console.log("🚨 ERRO DOLAR:");
console.log(error);

    return null;

  }

}

module.exports = {
  buscarDolar
};
