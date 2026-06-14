async function debugModo({
  message,
  phone,
  prisma,
  sendMessage,
  contextoSistema,
  modo1
}) {

  if (
    message.trim() !== "/debugmodo"
  ) {
    return false;
  }

  const cliente =
    await prisma.client.findFirst({
      where: { phone }
    });

  const usuario =
    await prisma.user.findFirst({
      where: { phone }
    });

  await sendMessage(
    phone,
`DEBUG

CLIENT:
${cliente?.aiMode || "NULL"}

USER:
${usuario?.aiMode || "NULL"}

CONTEXTO:
${contextoSistema === modo1
  ? "modo1"
  : "outro"}`
  );

  return true;
}

module.exports = {
  debugModo
};
