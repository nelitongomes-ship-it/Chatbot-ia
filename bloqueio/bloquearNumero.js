async function bloquearNumero({
  message,
  phone,
  prisma,
  sendMessage,
  adminSessions
}) {

  if (
    !message.startsWith("/bloquear") ||
    !adminSessions[phone]
  ) {
    return false;
  }

  const numero =
    message.replace("/bloquear", "").trim();

  const bloqueado =
    await prisma.blockedNumber.findFirst({
      where: {
        phone: numero
      }
    });

  if (!bloqueado) {

    await prisma.blockedNumber.create({
      data: {
        phone: numero
      }
    });

  }

  await sendMessage(
    phone,
    `🚫 Número bloqueado: ${numero}`
  );

  return true;
}

module.exports = {
  bloquearNumero
};
