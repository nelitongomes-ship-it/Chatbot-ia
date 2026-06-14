const axios = require("axios");

// =====================================================
// NOTÍCIAS FINANCEIRAS
// =====================================================

async function consultarNoticias({
  message,
  phone,
  sendMessage
}) {

  if (
    !message.toLowerCase().includes("notícias") &&
    !message.toLowerCase().includes("noticia") &&
    !message.toLowerCase().includes("manchetes")
  ) {
    return false;
  }

  try {

    console.log(
      "Consultando notícias..."
    );

    const response =
      await axios.get(
        `https://newsapi.org/v2/everything?q=mercado financeiro OR economia OR investimentos&language=pt&sortBy=publishedAt&pageSize=5&apiKey=${process.env.NEWS_API_KEY}`,
        {
          timeout: 10000
        }
      );

    const noticias =
      response.data.articles;

    if (!noticias.length) {

      await sendMessage(
        phone,
        "⚠️ Nenhuma notícia encontrada."
      );

      return true;
    }

    let resumo =
      "📰 Notícias Financeiras:\n\n";

    noticias.forEach((n, index) => {

      resumo +=
`${index + 1}️⃣ ${n.title}

Fonte: ${n.source.name}

`;
    });

    await sendMessage(
      phone,
      resumo
    );

  } catch (error) {

    console.log(
      "ERRO NEWS:",
      error.message
    );

    await sendMessage(
      phone,
      "⚠️ Não consegui consultar notícias agora."
    );

  }

  return true;
}

module.exports = {
  consultarNoticias
};
