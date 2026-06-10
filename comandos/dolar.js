const { buscarDolar } =
require("../cod.pesquisa/dolar");

module.exports = async function dolar({
  message,
  phone,
  sendMessage
}) {

  if (
    message.toLowerCase() !== "/dolar"
  ) {
    return false;
  }

  const dolar =
    await buscarDolar();

  if (!dolar) {

    await sendMessage(
      phone,
      "⚠️ Não consegui consultar a cotação do dólar agora."
    );

    return true;
  }

  await sendMessage(
    phone,
`💵 COTAÇÃO DO DÓLAR

📈 Compra: R$ ${dolar.compra}
📉 Venda: R$ ${dolar.venda}

⬆️ Máxima: R$ ${dolar.maxima}
⬇️ Mínima: R$ ${dolar.minima}

📊 Variação: ${dolar.variacao}%

🤖 Agils IA
Dados em tempo real.`
  );

  return true;

};
