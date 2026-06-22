module.exports = async function statusConta({
  textoLower,
  phone,
  prisma,
  sendMessage
}) {

  if (textoLower !== "status") {
    return false;
  }

  const usuario =
    await prisma.user.findFirst({
      where: {
        phone
      }
    });

  if (!usuario) {

    await sendMessage(
      phone,
      "❌ Usuário não encontrado."
    );

    return true;
  }

  await sendMessage(
    phone,
`📋 Status da conta

Plano: ${usuario.planType}

Modo: ${usuario.aiMode}

Ativo: ${usuario.isActive ? "SIM" : "NÃO"}`
  );

  return true;
};
