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
  
