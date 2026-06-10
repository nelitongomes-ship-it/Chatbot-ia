module.exports = async function estatisticas({
  message,
  phone,
  prisma,
  sendMessage,
  adminSessions
}) {

  if (
    message !== "/estatisticas" ||
    !adminSessions[phone]
  ) {
    return false;
  }

  console.log("📊 ESTATISTICAS EXECUTOU");

  const totalClientes =
    await prisma.client.count();

  const totalUsers =
    await prisma.user.count();

  const clientesAtivos =
    await prisma.client.count({
      where: {
        isActive: true
      }
    });

  const clientesInativos =
    await prisma.client.count({
      where: {
        isActive: false
      }
    });

  await sendMessage(
    phone,
`📊 PAINEL AGILS IA

👥 Clientes: ${totalClientes}
👤 Users: ${totalUsers}

🟢 Ativos: ${clientesAtivos}
🔴 Inativos: ${clientesInativos}`
  );

  return true;
};
