async function desbloquearNumero({
  message,
  phone,
  prisma,
  sendMessage,
  adminSessions
}) {

  if (
    !message.startsWith("/desbloquear") ||
    !adminSessions[phone]
  ) {
    return false;
  }

  const numero =
    message.replace(
      "/desbloquear",
      ""
    ).trim();

  await prisma.blockedNumber.deleteMany({
    where: {
      phone: numero
    }
  });

  await sendMessage(
    phone,
    `✅ Número desbloqueado: ${numero}`
  );

  return true;
}

module.exports = {
  desbloquearNumero
};
