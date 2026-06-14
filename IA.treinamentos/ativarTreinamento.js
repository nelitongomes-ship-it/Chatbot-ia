async function ativarTreinamento({
  message,
  phone,
  prisma,
  sendMessage,
  adminSessions
}) {

  if (
    !message.startsWith(
      "/ativartreinamento"
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
        "/ativartreinamento",
        ""
      )
      .trim()
  );

  if (!id) {

    await sendMessage(
      phone,
      "⚠️ Use:\n/ativartreinamento ID"
    );

    return true;
  }

  await prisma.training.update({
    where: {
      id
    },
    data: {
      active: true
    }
  });

  await sendMessage(
    phone,
    "🟢 Treinamento ativado."
  );

  return true;
}

module.exports = {
  ativarTreinamento
};
