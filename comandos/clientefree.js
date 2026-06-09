module.exports = async function clientefree({
  message,
  phone,
  prisma,
  sendMessage,
  adminSessions,
  res
}) {

  // =====================================================
  // CONTAR TESTES
  // =====================================================

  if (
    message === "/contartestes" &&
    adminSessions[phone]
  ) {

    const total =
      await prisma.user.count({
        where: {
          aiMode: "TESTE_GRATIS"
        }
      });

    await sendMessage(
      phone,
      `🧪 Total de testes: ${total}`
    );

    return true;
  }

  return false;
};
