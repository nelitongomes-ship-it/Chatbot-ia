module.exports = async function ({
  message,
  textoLower,
  phone,
  prisma,
  sendMessage,
  adminSessions,
  res
}) {


// =====================================================
// ATIVAR TESTE GRÁTIS
// =====================================================

if (
  textoLower.includes("teste grátis") ||
  textoLower.includes("teste gratis") ||
  textoLower.includes("quero testar") ||
  textoLower.includes("tem teste")
) {

  console.log("🎁 BLOCO TESTE GRATIS EXECUTOU");

  await prisma.user.updateMany({
    where: {
      phone
    },
    data: {
      aiMode: "AGUARDANDO_TESTE"
    }
  });

  const usuarioAguardando =
    await prisma.user.findFirst({
      where: {
        phone
      }
    });

  console.log(
    "USUÁRIO AGUARDANDO TESTE:"
  );
  console.log(usuarioAguardando);

  await sendMessage(
    phone,
`🎁 Posso liberar um teste grátis de 7 dias da Agils IA.

Durante o período de teste você poderá:

✅ Conversar com a IA
✅ Criar lembretes
✅ Agendar compromissos
✅ Organizar tarefas

Deseja ativar agora?

Responda apenas: SIM`
  );

  return true;
}
return false;

};

