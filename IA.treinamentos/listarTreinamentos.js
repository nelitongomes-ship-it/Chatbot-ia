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

    return true;
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

    return true;
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

  return true;
};
