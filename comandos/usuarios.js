module.exports = async function usuarios({
  message,
  phone,
  prisma,
  sendMessage,
  adminSessions,
  res
}) {

  if (message.trim() === "/vercadastro") {

    const usuarios =
      await prisma.user.findMany({
        orderBy: {
          id: "asc"
        }
      });

    let texto = "📋 CADASTROS USER\n\n";

    usuarios.forEach((u) => {
      texto +=

`ID: ${u.id}
TEL: ${u.phone}
PLANO: ${u.planType}
ATIVO: ${u.isActive}

━━━━━━━━━━━━━━━

`;
    });

    await sendMessage(
      phone,
      texto
    );

    return true;
  }

  return false;
};
