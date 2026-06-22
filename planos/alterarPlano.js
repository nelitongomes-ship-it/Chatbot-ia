async function alterarPlano({
  message,
  phone,
  prisma,
  sendMessage,
  adminSessions
}) {

  if (
    !message.startsWith("/alterarplano") ||
    !adminSessions[phone]
  ) {
    return false;
  }

  const dados =
    message
      .replace("/alterarplano", "")
      .trim()
      .split("|");

  const telefone =
    dados[0]?.trim();

  const novoPlano =
    dados[1]?.trim();

  if (
    !telefone ||
    !novoPlano
  ) {

    await sendMessage(
      phone,
      "⚠️ Use:\n\n/alterarplano TELEFONE|PLANO"
    );

    return true;
  }

  await prisma.client.updateMany({
    where: {
      phone: telefone
    },
    data: {
      planType: novoPlano
    }
  });

  await sendMessage(
    phone,
`📦 Plano alterado

📱 Telefone: ${telefone}
📦 Novo plano: ${novoPlano}`
  );

  return true;
}

module.exports = {
  alterarPlano
};
