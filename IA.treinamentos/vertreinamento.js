
async function verTreinamento({
  message,
  phone,
  prisma,
  sendMessage,
  adminSessions
}) {

  if (
    !message.startsWith("/vertreinamento")
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

  const id = parseInt(
    message
      .replace("/vertreinamento", "")
      .trim()
  );

  if (!id) {

    await sendMessage(
      phone,
      "⚠️ Use:\n/vertreinamento ID"
    );

    return true;
  }

  const treinamento =
    await prisma.training.findUnique({
      where: {
        id
      }
    });

  if (!treinamento) {

    await sendMessage(
      phone,
      "❌ Treinamento não encontrado."
    );

    return true;
  }

  await sendMessage(
    phone,
`📚 TREINAMENTO #${treinamento.id}

📝 Título:
${treinamento.title}

📖 Conteúdo:
${treinamento.content}

📌 Status:
${treinamento.active ? "Ativo" : "Inativo"}`
  );

  return true;
}

module.exports = {
  verTreinamento
};
