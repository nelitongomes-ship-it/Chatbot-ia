//≈==========================================
//  VER CADASTRO
//=========================≈======≈==========
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
  //==≈==================================
  //  LISTAR USUARIOS
  //=======================≈=≈===========
  if (
  message === "/listarusuarios" &&
  adminSessions[phone]
) {

  const usuarios = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });

  let resposta =
    "👥 Usuários cadastrados:\n\n";

  usuarios.forEach((u, i) => {

    resposta +=
      `${i + 1}. ${u.name || "Sem nome"}\n`;

    resposta +=
      `📞 ${u.phone}\n\n`;

  });

  await sendMessage(
    phone,
    resposta || "Nenhum usuário encontrado."
  );

  return true;
}

  return false;
};
