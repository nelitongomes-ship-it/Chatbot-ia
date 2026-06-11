module.exports = async function listarTreinamentos({
  message,
  phone,
  sendMessage,
  prisma,
  adminSessions,
  res
}) {

  if (
    !message ||
    message.toLowerCase() !== "/treinamentos"
  ) {
    return false;
  }

  if (!adminSessions[phone]) {

    await sendMessage(
      phone,
      "⛔ Faça login administrativo."
    );

    return res.sendStatus(200);
  }

  const treinamentos =
    await prisma.training.findMany({
      orderBy: {
        id: "asc"
      }
    });

  if (treinamentos.length === 0) {

    await sendMessage(
      phone,
      "📚 Nenhum treinamento cadastrado."
    );

    return res.sendStatus(200);
  }

  let texto =
    "📚 TREINAMENTOS DA AGILS IA\n\n";

  treinamentos.forEach(t => {

    texto +=
      `ID: ${t.id}\n` +
      `Título: ${t.title}\n` +
      `Status: ${
        t.active
          ? "🟢 Ativo"
          : "🔴 Inativo"
      }\n\n`;

  });

  await sendMessage(
    phone,
    texto
  );

  return res.sendStatus(200);
};
