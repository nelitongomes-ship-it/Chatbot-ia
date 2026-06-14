async function verificarBloqueio({
  phone,
  prisma
}) {

  const blocked =
    await prisma.blockedNumber.findFirst({
      where: {
        phone
      }
    });

  if (!blocked) {
    return false;
  }

  console.log(
    "🚫 NÚMERO BLOQUEADO:",
    phone
  );

  return true;
}

module.exports = {
  verificarBloqueio
};
