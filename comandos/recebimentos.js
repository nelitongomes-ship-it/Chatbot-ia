// =====================================================
// CONFIRMAR PAGAMENTO
// =====================================================

if (
  message.startsWith("/confirmarpagamento") &&
  adminSessions[phone]
) {

  const partes = message.split(" ");

  if (partes.length < 2) {

    await sendMessage(
      phone,
      "❌ Use:\n/confirmarpagamento NUMERO"
    );

    return;
  }

  const numeroCliente =
    partes[1].replace(/\D/g, "");

  const cliente =
    await prisma.client.findFirst({
      where: {
        phone: {
          contains: numeroCliente
        }
      }
    });

  if (!cliente) {

    await sendMessage(
      phone,
      "❌ Cliente não encontrado."
    );

    return;
  }

  await prisma.client.update({
    where: {
      id: cliente.id
    },
    data: {
      paymentStatus: "PAID",
      lastPaymentAt: new Date(),
      isActive: true
    }
  });

  await sendMessage(
    phone,
    `✅ Pagamento confirmado!

👤 Cliente: ${cliente.name}
📱 Telefone: ${cliente.phone}`
  );

  await client.sendMessage(
    cliente.phone,
    `✅ Pagamento confirmado com sucesso.

Seu acesso à Agils IA permanece ativo.`
  );

  return;
}
