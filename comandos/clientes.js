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
// ALTERAR SENHA CLIENTE
// =====================================================

if (
  message.startsWith("/alterarsenha") &&
  adminSessions[phone]
) {

  const dados =
    message.replace("/alterarsenha", "")
    .trim()
    .split("|");

  const telefone = dados[0]?.trim();
  const novaSenha = dados[1]?.trim();

  if (!telefone || !novaSenha) {

    await sendMessage(
      phone,
`⚠️ Use:

/alterarsenha Telefone | NovaSenha

Exemplo:

/alterarsenha 5516999999999 | 1234`
    );

    return true;
  }

  const cliente =
    await prisma.client.findFirst({
      where: {
        phone: telefone
      }
    });

  if (!cliente) {

    await sendMessage(
      phone,
      "❌ Cliente não encontrado."
    );

    return true;
  }

  await prisma.client.update({
    where: {
      id: cliente.id
    },
    data: {
      password: novaSenha
    }
  });

  await sendMessage(
    phone,
`🔐 SENHA ALTERADA COM SUCESSO

👤 Cliente: ${cliente.name}
📱 Telefone: ${telefone}

🔑 Nova senha:
${novaSenha}`
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

// =====================================================
// EXCLUIR CLIENTE
// =====================================================

if (
  message.startsWith("/excluircliente") &&
  adminSessions[phone]
) {

  const telefone =
    message.replace("/excluircliente", "")
    .trim();

  if (!telefone) {

    await sendMessage(
      phone,
      "⚠️ Use:\n/excluircliente 5511999999999"
    );

    return true;
  }

  await prisma.client.deleteMany({
    where: {
      phone: telefone
    }
  });

  await sendMessage(
    phone,
`🗑️ Cliente excluído com sucesso

📱 ${telefone}`
  );

  return true;
}

// =====================================================
// EXCLUIR CLIENTE POR CPF
// =====================================================

if (
  message.startsWith("/excluircpf") &&
  adminSessions[phone]
) {

  const cpf =
    message
      .replace("/excluircpf", "")
      .trim()
      .replace(/\D/g, "");

  const cliente =
    await prisma.client.findFirst({
      where: {
        cpf
      }
    });

  if (!cliente) {

    await sendMessage(
      phone,
      "❌ Cliente não encontrado."
    );

    return true;
  }

  await prisma.client.delete({
    where: {
      id: cliente.id
    }
  });

  await sendMessage(
    phone,
`🗑️ Cliente removido

👤 ${cliente.name}
🪪 ${cliente.cpf}`
  );

  return true;
}

// =====================================================
// VER CLIENTE POR CPF
// =====================================================

if (
  message.startsWith("/verclientecpf") &&
  adminSessions[phone]
) {

  const cpfBusca =
    message
      .replace("/verclientecpf", "")
      .trim()
      .replace(/\D/g, "");

  const cliente =
    await prisma.client.findFirst({
      where: {
        cpf: cpfBusca
      }
    });

  if (!cliente) {

    await sendMessage(
      phone,
      "❌ Cliente não encontrado."
    );

    return true;
  }

  await sendMessage(
    phone,
`👤 CLIENTE

Nome: ${cliente.name}
Telefone: ${cliente.phone}
CPF: ${cliente.cpf}
Contrato: ${cliente.contractNumber || "Não informado"}
Plano: ${cliente.planType}
Modo IA: ${cliente.aiMode}
Valor: R$ ${cliente.totalValue || 0}
Status: ${cliente.isActive ? "ATIVO" : "INATIVO"}`
  );

  return true;
}

// =====================================================
// CONSULTAR CLIENTE N° Telefone 
// =====================================================

if (
  message.startsWith("/cliente") &&
  adminSessions[phone]
) {

  const telefone =
    message.replace("/cliente", "")
    .trim();

  const clienteConsulta =
    await prisma.client.findFirst({
      where: {
        phone: telefone
      }
    });

  const usuarioConsulta =
    await prisma.user.findFirst({
      where: {
        phone: telefone
      }
    });

  if (!clienteConsulta && !usuarioConsulta) {

    await sendMessage(
      phone,
      "❌ Cliente não encontrado."
    );

    return true;
  }

  if (clienteConsulta) {

    await sendMessage(
      phone,
`👤 CLIENTE

Nome: ${clienteConsulta.name}
Telefone: ${clienteConsulta.phone}

📅 Cadastro:
${clienteConsulta.createdAt
  ? new Date(
      clienteConsulta.createdAt
    ).toLocaleString("pt-BR")
  : "Não informado"}

📦 Plano:
${clienteConsulta.planType}

🤖 Modo IA:
${clienteConsulta.aiMode}

🟢 Status:
${clienteConsulta.isActive ? "Ativo" : "Inativo"}

💳 Pagamento:
${
  clienteConsulta.paymentStatus === "PAID"
    ? "✅ Pago"
    : clienteConsulta.paymentStatus === "PENDENTE"
    ? "⚠️ Pendente"
    : clienteConsulta.paymentStatus || "Não informado"
}

📅 Data Pagamento:
${clienteConsulta.paymentDate
  ? new Date(
      clienteConsulta.paymentDate
    ).toLocaleString("pt-BR")
  : "Não registrado"}

🔐 Senha:
${clienteConsulta.password}`
    );

    return true;
  }

  await sendMessage(
    phone,
`🧪 USUÁRIO TESTE

Nome: ${usuarioConsulta.name || "Não informado"}
Telefone: ${usuarioConsulta.phone}

📅 Cadastro:
${usuarioConsulta.createdAt
  ? new Date(
      usuarioConsulta.createdAt
    ).toLocaleString("pt-BR")
  : "Não informado"}

📦 Plano:
${usuarioConsulta.planType}

🤖 Modo IA:
${usuarioConsulta.aiMode}

🟢 Status:
${usuarioConsulta.isActive ? "Ativo" : "Inativo"}

🚀 Início:
${usuarioConsulta.trialStartAt
  ? new Date(
      usuarioConsulta.trialStartAt
    ).toLocaleString("pt-BR")
  : "Não informado"}

🏁 Término:
${usuarioConsulta.trialEndAt
  ? new Date(
      usuarioConsulta.trialEndAt
    ).toLocaleString("pt-BR")
  : "Não informado"}`
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
