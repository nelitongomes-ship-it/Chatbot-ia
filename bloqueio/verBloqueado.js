async function verBloqueado({
  message,
  phone,
  prisma,
  sendMessage,
  adminSessions
}) {

  if (
    !message.startsWith("/verbloqueado") ||
    !adminSessions[phone]
  ) {
    return false;
  }

  const numero =
    message.replace(
      "/verbloqueado",
      ""
    ).trim();

  if (!numero) {

    await sendMessage(
      phone,
      "⚠️ Informe um número.\n\nExemplo:\n/verbloqueado 5516999999999"
    );

    return true;
  }

  const bloqueado =
    await prisma.blockedNumber.findFirst({
      where: {
        phone: numero
      }
    });

  if (bloqueado) {

    await sendMessage(
      phone,
      `🚫 O número ${numero} está bloqueado.`
    );

  } else {

    await sendMessage(
      phone,
      `✅ O número ${numero} não está bloqueado.`
    );

  }

  return true;
}

module.exports = {
  verBloqueado
};
