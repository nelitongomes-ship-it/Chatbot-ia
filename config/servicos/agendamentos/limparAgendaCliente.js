async function limparAgendaCliente({
  message,
  phone,
  prisma,
  sendMessage
}) {

  if (
    !message.startsWith(
      "/limparagendacliente"
    )
  ) {
    return false;
  }

  const telefone =
    message
      .replace(
        "/limparagendacliente",
        ""
      )
      .trim();

  if (!telefone) {

    await sendMessage(
      phone,
      "⚠️ Informe o telefone.\n\nExemplo:\n/limparagendacliente 5516992040119"
    );

    return true;
  }

  const resultado =
    await prisma.appointment.deleteMany({
      where: {
        phone: telefone
      }
    });

  await sendMessage(
    phone,
`🗑️ Compromissos removidos

📱 ${telefone}

📋 Total removido: ${resultado.count}`
  );

  return true;
}

module.exports = {
  limparAgendaCliente
};
