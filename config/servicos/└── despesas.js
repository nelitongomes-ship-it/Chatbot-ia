// =====================================================
// REGISTRO DE DESPESAS - AGILS IA
// =====================================================

async function registrarDespesa({
prisma,
phone,
valor,
categoria,
descricao,
dataRegistro  
  
}) {
console.log("🔥 REGISTRAR DESPESA CHAMADO");
  console.log({
    phone,
    valor,
    categoria,
    descricao,
    dataRegistro
 });
   try {

const despesa =
  await prisma.expense.create({
    data: {
      phone,
      value: Number(valor),
      category: categoria,
      description: descricao,
      createdAt: dataRegistro
      
    }
  });
console.log("🔥 RETORNANDO:");
console.log({
  sucesso: true
});

  
return {
  sucesso: true,
  despesa
};

} catch (erro) {

console.error(
  "ERRO AO REGISTRAR DESPESA:",
  erro
);

return {
  sucesso: false
};

}

}
// =====================================================
// REGISTRO DE DESPESAS - AGILS IA
// =====================================================

async function registrarDespesa({
  prisma,
  phone,
  valor,
  categoria,
  descricao,
  dataRegistro
}) {

  console.log("🔥 REGISTRAR DESPESA CHAMADO");

  console.log({
    phone,
    valor,
    categoria,
    descricao,
    dataRegistro
  });

  try {

    const despesa =
      await prisma.expense.create({
        data: {
          phone,
          value: Number(valor),
          category: categoria,
          description: descricao,
          createdAt: dataRegistro
        }
      });

    console.log("🔥 RETORNANDO:");

    console.log({
      sucesso: true
    });

    return {
      sucesso: true,
      despesa
    };

  } catch (erro) {

    console.error(
      "ERRO AO REGISTRAR DESPESA:",
      erro
    );

    return {
      sucesso: false
    };

  }

}

// =====================================================
// PROCESSA BLOCO [REGISTRAR_DESPESA]
// =====================================================

async function processarRegistroDespesa({
  respostaIA,
  prisma,
  phone
}) {

  console.log(
    "🔥🔥🔥 ENTROU EM processarRegistroDespesa"
  );

  const match =
    respostaIA.match(
      /\[REGISTRAR_DESPESA\]([\s\S]*?)\[\/REGISTRAR_DESPESA\]/
    );

  if (!match) {
    return null;
  }

  const conteudo = match[1];

  const valor =
    conteudo.match(
      /VALOR:\s*(.+)/i
    )?.[1]?.trim();

  const categoria =
    conteudo.match(
      /CATEGORIA:\s*(.+)/i
    )?.[1]?.trim();

  const descricao =
    conteudo.match(
      /DESCRI.*?:\s*(.+)/i
    )?.[1]?.trim();

  const dataInformada =
    conteudo.match(
      /DATA:\s*(.+)/i
    )?.[1]?.trim();

  const horaInformada =
    conteudo.match(
      /HORA:\s*(.+)/i
    )?.[1]?.trim();

  let dataRegistro = new Date();

  if (
    descricao?.toLowerCase().includes("ontem")
  ) {

    dataRegistro.setDate(
      dataRegistro.getDate() - 1
    );

  }

  if (
    descricao?.toLowerCase().includes("hoje")
  ) {

    dataRegistro = new Date();

  }

  if (
    dataInformada &&
    horaInformada
  ) {

    const [dia, mes, ano] =
      dataInformada.split("/");

    const [hora, minuto] =
      horaInformada.split(":");

    dataRegistro = new Date(
      ano,
      mes - 1,
      dia,
      hora,
      minuto
    );

  }

  console.log("🔥 VALOR:", valor);
  console.log("🔥 CATEGORIA:", categoria);
  console.log("🔥 DESCRICAO:", descricao);

  if (
    !valor ||
    !categoria
  ) {

    return {
      sucesso: false
    };

  }

  return await registrarDespesa({
    prisma,
    phone,
    valor: parseFloat(
      valor.replace(",", ".")
    ),
    categoria,
    descricao,
    dataRegistro
  });

}

module.exports = {
  registrarDespesa,
  processarRegistroDespesa
};
