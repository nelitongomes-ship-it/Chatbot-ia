async function desativarTreinamento({
  message,
  phone,
  prisma,
  sendMessage,
  adminSessions
}) {

  if (
    !message.startsWith(
      "/desativartreinamento"
    )
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
      .replace(
        "/desativartreinamento",
        ""
      )
      .trim()
  );

  if (!id) {

    await sendMessage(
      phone,
      "⚠️ Use:\n/desativartreinamento ID"
    );

    return true;
  }

  await prisma.training.update({
    where: {
      id
    },
    data: {
      active: false
    }
  });

  await sendMessage(
    phone,
    "🔴 Treinamento desativado."
  );

  return true;
}

module.exports = {
  desativarTreinamento
};
