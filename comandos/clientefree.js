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

// =====================================================
// CLIENTES TESTE TABELA USER
// =====================================================

if (
  message === "/clientestestouser" &&
  adminSessions[phone]
) {

  const usuariosTeste =
    await prisma.user.findMany({
      where: {
        aiMode: "TESTE_GRATIS"
      },
      orderBy: {
        trialEndAt: "asc"
      }
    });

  if (usuariosTeste.length === 0) {

    await sendMessage(
      phone,
      "🧪 Nenhum cliente em período de teste."
    );

    return true;
  }

  let resposta =
    `🧪 CLIENTES EM TESTE\n\n` +
    `📊 Total: ${usuariosTeste.length}\n\n`;

  const agora = new Date();

  for (const user of usuariosTeste) {

    const inicio =
      user.trialStartAt
        ? new Date(user.trialStartAt)
        : null;

    const fim =
      user.trialEndAt
        ? new Date(user.trialEndAt)
        : null;

    const diasRestantes =
      fim
        ? Math.ceil(
            (fim.getTime() - agora.getTime()) /
            (1000 * 60 * 60 * 24)
          )
        : 0;

    resposta +=
      `👤 ${user.name || "Sem nome"}\n` +
      `📱 ${user.phone.replace("@c.us", "")}\n` +
      `🚀 Início: ${
        inicio
          ? inicio.toLocaleString("pt-BR")
          : "Não informado"
      }\n` +
      `🏁 Término: ${
        fim
          ? fim.toLocaleString("pt-BR")
          : "Não informado"
      }\n` +
      `⏳ Restam: ${diasRestantes} dias\n\n`;
  }

  await sendMessage(
    phone,
    resposta
  );

  return true;
}

// =====================================================
// CLIENTES TESTE GRATIS (CLIENTE)
// =====================================================

if (
  message === "/clientesteste" &&
  adminSessions[phone]
) {

  const clientesTeste =
    await prisma.client.findMany({
      where: {
        aiMode: "TESTE_GRATIS"
      },
      orderBy: {
        trialEndAt: "asc"
      }
    });

  if (clientesTeste.length === 0) {

    await sendMessage(
      phone,
      "🧪 Nenhum cliente em período de teste."
    );

    return true;
  }

  let resposta =
    `🧪 CLIENTES EM TESTE\n\n` +
    `📊 Total: ${clientesTeste.length}\n\n`;

  const agora = new Date();

  for (const cliente of clientesTeste) {

    const diasRestantes =
      cliente.trialEndAt
        ? Math.ceil(
            (new Date(cliente.trialEndAt) - agora) /
            (1000 * 60 * 60 * 24)
          )
        : 0;

    resposta +=
      `👤 ${cliente.name}\n` +
      `📱 ${cliente.phone}\n` +
      `🚀 Início: ${
        cliente.trialStartAt
          ? new Date(cliente.trialStartAt)
              .toLocaleString("pt-BR")
          : "Não informado"
      }\n` +
      `🏁 Término: ${
        cliente.trialEndAt
          ? new Date(cliente.trialEndAt)
              .toLocaleString("pt-BR")
          : "Não informado"
      }\n` +
      `⏳ Restam: ${diasRestantes} dias\n\n`;
  }

  await sendMessage(
    phone,
    resposta
  );

  return true;
}
