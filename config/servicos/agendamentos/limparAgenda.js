async function limparAgenda({
  message,
  phone,
  prisma,
  sendMessage,
  adminSessions
}) {

  if (
    message.trim() !== "/limparagenda" ||
    !adminSessions[phone]
  ) {
    return false;
  }

  console.log(
    "LIMPANDO AGENDA COMPLETA"
  );

  await prisma.appointment.deleteMany({});

  await sendMessage(
    phone,
    "🗑️ Todos os compromissos foram removidos."
  );

  return true;
}

module.exports = {
  limparAgenda
};
