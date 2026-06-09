// LISTAR CLIENTES
// =====================================================

if (
  message === "/listarclientes" &&
  adminSessions[phone]
) {

  const clientes =
    await prisma.client.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

  if (!clientes.length) {

    await sendMessage(
      phone,
      "📭 Nenhum cliente cadastrado."
    );

    return res.sendStatus(200);
  }

  let resposta =
    "📋 CLIENTES CADASTRADOS\n\n";

  clientes.forEach((cliente, index) => {

    resposta +=
`${index + 1}️⃣ ${cliente.name}

📱 ${cliente.phone}
📦 ${cliente.planType}
🟢 ${cliente.isActive ? "ATIVO" : "INATIVO"}

`;
  });

  await sendMessage(
    phone,
    resposta
  );

  return res.sendStatus(200);
}
