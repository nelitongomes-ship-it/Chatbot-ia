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

  // =====================================================
// CONFIRMAÇÃO TESTE
// =====================================================

const usuarioTeste =
  await prisma.user.findFirst({
    where: {
      phone
    }
  });

console.log("PHONE RECEBIDO:");
console.log(phone);

console.log("AI MODE:");
console.log(usuarioTeste?.aiMode);

console.log("TEXTO LOWER:");
console.log(textoLower);

console.log("USUARIO TESTE:");
console.log(usuarioTeste);

if (
  textoLower === "sim" &&
  usuarioTeste?.aiMode === "AGUARDANDO_TESTE"
) {

  console.log(
    "🔥🔥🔥 ENTROU NO BLOCO TESTE GRATIS 🔥🔥🔥"
  );

  const agora = new Date();

  const fimTeste = new Date(
    Date.now() +
    7 * 24 * 60 * 60 * 1000
  );

  const clienteExistente =
    await prisma.client.findFirst({
      where: {
        phone
      }
    });

  if (!clienteExistente) {

    await prisma.client.create({
      data: {
        name: "Cliente Teste",
        fullName: "Cliente Teste",
        email: "",
        phone: phone,

        serviceType: "AGILS_IA",
        planType: ""TESTE_GRATIS",

        selectedPlan: "teste",

        aiMode: "TESTE_GRATIS",

        isActive: true,

        paymentStatus: "APROVADO",

        dailyLimit: 20,

        trialStartAt: agora,
        trialEndAt: fimTeste
      }
    });

    console.log(
      "✅ CLIENTE TESTE CRIADO"
    );

  } else {

    await prisma.client.update({
      where: {
        id: clienteExistente.id
      },
      data: {
        selectedPlan: "teste",

        aiMode: "TESTE_GRATIS",

        isActive: true,

        paymentStatus: "APROVADO",

        dailyLimit: 20,

        trialStartAt: agora,
        trialEndAt: fimTeste
      }
    });

    console.log(
      "✅ CLIENTE TESTE ATUALIZADO"
    );

  }

  await prisma.user.updateMany({
    where: {
      phone
    },
    data: {
      aiMode: "TESTE_GRATIS",
      isActive: true,
      trialStartAt: agora,
      trialEndAt: fimTeste
    }
  });

  const clienteFinal =
    await prisma.client.findFirst({
      where: {
        phone
      }
    });

  console.log(
    "CLIENTE APÓS ATIVAÇÃO:"
  );
  console.log(clienteFinal);

  await sendMessage(
    phone,
`🎉 Teste grátis ativado com sucesso!

✅ Seu cadastro foi concluído.

📅 Validade do teste:
${fimTeste.toLocaleDateString("pt-BR")}

Agora você já pode utilizar todos os recursos da Agils IA.`
  );

  return true;
}
return false;

};

