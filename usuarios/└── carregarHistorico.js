module.exports = async function carregarHistorico({
  prisma,
  phone
}) {

  const historico =
    await prisma.message.findMany({
      where: {
        phone
      },
      orderBy: {
        createdAt: "asc"
      },
      take: 100
    });

  return historico;
};
