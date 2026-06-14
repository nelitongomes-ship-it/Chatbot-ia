async function editarTreinamento({
  message,
  phone,
  prisma,
  sendMessage,
  adminSessions
}) {

  if (
    !message.startsWith("/editartreinamento")
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

  const dados =
    message
      .replace("/editartreinamento", "")
      .trim();

  const partes =
    dados.split("|");

  const id =
    parseInt(
      partes[0]?.trim()
    );

  const novoConteudo =
    partes[1]?.trim();

  if (
    !id ||
    !novoConteudo
  ) {

    await sendMessage(
      phone,
      "⚠️ Use:\n/editartreinamento ID|Novo conteúdo"
    );

    return true;
  }

  await prisma.training.update({
    where: {
      id
    },
    data: {
      content: novoConteudo
    }
  });

  await sendMessage(
    phone,
    "✅ Treinamento atualizado."
  );

  return true;
}

module.exports = {
  editarTreinamento
};
