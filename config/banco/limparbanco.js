async function limparBanco({
  message,
  phone,
  prisma,
  sendMessage,
  adminSessions
}) {

  if (
    message !== "/limparbanco" ||
    !adminSessions[phone]
  ) {
    return false;
  }

  await prisma.payment.deleteMany({});
  await prisma.contract.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.expense.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.client.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.blockedNumber.deleteMany({});

  await sendMessage(
    phone,
    "✅ Banco limpo com sucesso."
  );

  return true;
}

module.exports = {
  limparBanco
};
