// =====================================================
// CADASTRAR CLIENTE
// =====================================================

if (
  message.startsWith("/cadastrarcliente") &&
  adminSessions[phone]
) {

  const dados = message
    .replace("/cadastrarcliente", "")
    .trim()
    .split("|");

  const nome = dados[0]?.trim();
  const telefone = dados[1]?.trim();
  const cpf = dados[2]?.trim();
  const senha = dados[3]?.trim();
  const plano = dados[4]?.trim()?.toUpperCase();

  if (
    !nome ||
    !telefone ||
    !cpf ||
    !senha ||
    !plano
  ) {

    await sendMessage(
      phone,
`⚠️ FORMATO CORRETO

/cadastrarcliente Nome | Telefone | CPF | Senha | Plano

Exemplo:

/cadastrarcliente João Silva | 16999999999 | 12345678900 | 1234 | BASICO`
    );

    return true;
  }

  const telefoneFinal =
    telefone.replace(/\D/g, "").startsWith("55")
      ? telefone.replace(/\D/g, "")
      : "55" + telefone.replace(/\D/g, "");

  const existingClient =
    await prisma.client.findFirst({
      where: {
        phone: telefoneFinal
      }
    });

  if (existingClient) {

    await sendMessage(
      phone,
      "⚠️ Cliente já cadastrado."
    );

    return true;
  }

  let modo = "SEM_CADASTRO";

  if (plano === "BASICO") modo = "BASICO";
  if (plano === "INTERMEDIARIO") modo = "INTERMEDIARIO";
  if (plano === "AGILS_CRED") modo = "AGILS_CRED";
  if (plano === "AVANCADO") modo = "AVANCADO";
  if (plano === "TESTE_GRATIS") modo = "TESTE_GRATIS";

  await prisma.client.create({
    data: {
      name: nome,
      fullName: nome,
      cpf: cpf,
      phone: telefoneFinal,
      password: senha,
      planType: plano,
      serviceType: plano,
      aiMode: modo,
      isActive: true
    }
  });

  await sendMessage(
    phone,
`✅ CLIENTE CADASTRADO COM SUCESSO

👤 Nome: ${nome}
📱 Telefone: ${telefoneFinal}
🪪 CPF: ${cpf}
📦 Plano: ${plano}
🤖 Modo IA: ${modo}`
  );

  return true;
}

// =====================================================
// DESATIVAR CLIENTE
// =====================================================

if (
  message.startsWith("/desativarcliente") &&
  adminSessions[phone]
) {

  const telefone =
    message.replace("/desativarcliente", "")
    .trim();

  await prisma.client.updateMany({
    where: {
      phone: telefone
    },
    data: {
      isActive: false
    }
  });

  await sendMessage(
    phone,
`🚫 Cliente desativado

📱 ${telefone}`
  );

  return true;
}

// =====================================================
// REATIVAR CLIENTE
// =====================================================

if (
  message.startsWith("/reativarcliente") &&
  adminSessions[phone]
) {

  const telefone =
    message.replace("/reativarcliente", "")
    .trim();

  await prisma.client.updateMany({
    where: {
      phone: telefone
    },
    data: {
      isActive: true
    }
  });

  await sendMessage(
    phone,
`✅ Cliente reativado

📱 ${telefone}`
  );

  return true;
}

//======================================================
// LISTAR CLIENTES
// =====================================================

if (
  message === "/listarclientes" &&
  adminSessions[phone]
) {

  const clientes =
    await prisma.client.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

  if (!clientes.length) {

    await sendMessage(
      phone,
      "📭 Nenhum cliente cadastrado."
    );

    return res.sendStatus(200);
  }

  let resposta =
    "📋 CLIENTES CADASTRADOS\n\n";

  clientes.forEach((cliente, index) => {

    resposta +=
`${index + 1}️⃣ ${cliente.name}

📱 ${cliente.phone}
📦 ${cliente.planType}
🟢 ${cliente.isActive ? "ATIVO" : "INATIVO"}

`;
  });

  await sendMessage(
    phone,
    resposta
  );

  return res.sendStatus(200);
}
