//≈==========================================
//  VER CADASTRO TABELA USER VISITANTES 
//=========================≈======≈==========
module.exports = async function usuarios({
  message,
  phone,
  prisma,
  sendMessage,
  adminSessions,
  res
}) {

  console.log("🔥 USUARIOS.JS EXECUTOU 🔥");

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
  //  LISTAR CLIENTES VER USUARIO
  //=======================≈=≈===========
  
if (
  message.startsWith("/verusuario") &&
  adminSessions[phone]
) {

  const telefone =
    message.replace("/verusuario", "")
    .trim();

  const usuario =
    await prisma.user.findFirst({
      where: {
        phone: telefone
      }
    });

  if (!usuario) {

    await sendMessage(
      phone,
      "❌ Usuário não encontrado."
    );

    return true;
  }

  await sendMessage(
    phone,
`👤 USUÁRIO

Nome: ${usuario.name || "Não informado"}
Telefone: ${usuario.phone}
Plano: ${usuario.planType || "Não informado"}
Modo IA: ${usuario.aiMode}
Status: ${usuario.isActive ? "Ativo" : "Inativo"}

🚀 Início:
${usuario.trialStartAt
  ? new Date(usuario.trialStartAt).toLocaleString("pt-BR")
  : "Não informado"}

🏁 Término:
${usuario.trialEndAt
  ? new Date(usuario.trialEndAt).toLocaleString("pt-BR")
  : "Não informado"}`
  );

  return true;
}

  // =====================================================
// MONITOR USER
// =====================================================

if (
  message === "/monitoruser" &&
  adminSessions[phone]
) {

  const semCadastro =
    await prisma.user.count({
      where: {
        aiMode: "SEM_CADASTRO"
      }
    });

  const aguardandoTeste =
    await prisma.user.count({
      where: {
        aiMode: "AGUARDANDO_TESTE"
      }
    });

  const testeGratis =
    await prisma.user.count({
      where: {
        aiMode: "TESTE_GRATIS"
      }
    });

  const total =
    await prisma.user.count();

  await sendMessage(
    phone,
`📊 MONITOR USER

👥 SEM_CADASTRO: ${semCadastro}

🎁 AGUARDANDO_TESTE: ${aguardandoTeste}

🧪 TESTE_GRATIS: ${testeGratis}

📈 TOTAL USER: ${total}`
  );

  return true;
}

  // =====================================================
// VISITANTES
// =====================================================

if (
  message === "/visitantes" &&
  adminSessions[phone]
) {

  const usuarios =
    await prisma.user.findMany({
      where: {
        aiMode: "SEM_CADASTRO"
      },
      orderBy: {
        createdAt: "desc"
      }
    });

  if (!usuarios.length) {

    await sendMessage(
      phone,
      "📭 Nenhum visitante encontrado."
    );

    return true;
  }

  let resposta =
    `👥 VISITANTES\n\n` +
    `📊 Total: ${usuarios.length}\n\n`;

  for (const user of usuarios) {

    resposta +=
      `📱 ${user.phone.replace("@c.us","")}\n` +
      `📅 ${new Date(
        user.createdAt
      ).toLocaleString("pt-BR")}\n\n`;
  }

  await sendMessage(
    phone,
    resposta
  );

  return true;
}
  return false;

};
