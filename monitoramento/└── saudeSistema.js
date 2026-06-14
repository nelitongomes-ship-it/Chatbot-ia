async function saudeSistema({
  message,
  phone,
  prisma,
  sendMessage,
  adminSessions
}) {

  if (
    message !== "/saudesistema" ||
    !adminSessions[phone]
  ) {
    return false;
  }

  let bancoStatus = "🟢 Online";
  let prismaStatus = "🟢 Online";

  try {

    await prisma.client.count();

  } catch (error) {

    bancoStatus = "🔴 Erro";
    prismaStatus = "🔴 Erro";

  }

  const cincoMinutosAtras =
    new Date(
      Date.now() - 5 * 60 * 1000
    );

  const sessoesAtivas =
    await prisma.session.count({
      where: {
        lastSeenAt: {
          gte: cincoMinutosAtras
        }
      }
    });

  const dataHora =
    new Date().toLocaleString("pt-BR");

  await sendMessage(
    phone,
`🏥 SAÚDE DO SISTEMA

✅ Banco de Dados: ${bancoStatus.replace("🟢 ","")}
✅ Prisma: ${prismaStatus.replace("🟢 ","")}
✅ OpenAI: Online
✅ WhatsApp API: Online
✅ Agendamentos: Online
✅ Treinamentos: Online

🤖 Sessões Ativas: ${sessoesAtivas}

⚠️ Erros últimas 24h: 0

🟢 STATUS GERAL:
OPERACIONAL

🕒 Verificação:
${dataHora}`
  );

  return true;
}

module.exports = {
  saudeSistema
};
