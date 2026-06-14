async function listarBloqueados({
  message,
  phone,
  prisma,
  sendMessage,
  adminSessions
}) {

  if (
    message !== "/bloqueados" ||
    !adminSessions[phone]
  ) {
    return false;
  }

  const bloqueados =
    await prisma.blockedNumber.findMany({
      orderBy: {
        phone: "asc"
      }
    });

  if (bloqueados.length === 0) {

    await sendMessage(
      phone,
      "✅ Nenhum número bloqueado."
    );

    return true;
  }

  let lista =
    "🚫 NÚMEROS BLOQUEADOS\n\n";

  bloqueados.forEach((item, index) => {

    lista +=
      `${index + 1}. ${item.phone}\n`;

  });

  lista +=
    `\nTotal: ${bloqueados.length}`;

  await sendMessage(
    phone,
    lista
  );

  return true;
}

module.exports = {
  listarBloqueados
};
