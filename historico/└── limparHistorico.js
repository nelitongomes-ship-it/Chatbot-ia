module.exports = async function limparHistorico({
  message,
  phone,
  prisma,
  sendMessage,
  adminSessions,
  pendingDeletes
}) {

  // LIMPAR HISTÓRICO
  if (
    message.startsWith("/limparhistorico") &&
    adminSessions[phone]
  ) {

    const numero =
      message
        .replace("/limparhistorico", "")
        .trim();

    if (!numero) {

      await sendMessage(
        phone,
        "⚠️ Use:\n/limparhistorico 5511999999999"
      );

      return true;
    }

    pendingDeletes[phone] = numero;

    await sendMessage(
      phone,
      `⚠️ Confirma apagar todo histórico do número:\n\n${numero}\n\nDigite:\n/sim`
    );

    return true;
  }

  // CONFIRMAR LIMPEZA
  if (
    message.toLowerCase() === "/sim" &&
    adminSessions[phone]
  ) {

    const numero =
      pendingDeletes[phone];

    if (!numero) {

      await sendMessage(
        phone,
        "⚠️ Nenhuma limpeza pendente."
      );

      return true;
    }

    await prisma.message.deleteMany({
      where: {
        phone: numero
      }
    });

    delete pendingDeletes[phone];

    await sendMessage(
      phone,
      `🗑️ Histórico apagado com sucesso.\n\nNúmero: ${numero}`
    );

    return true;
  }

  return false;
};
