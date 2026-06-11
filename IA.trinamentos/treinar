module.exports = async function carregarTreinamentos(
  prisma
) {

  const treinamentos =
    await prisma.training.findMany({
      where: {
        active: true
      },
      orderBy: {
        id: "desc"
      },
      take: 30
    });

  let memoriaTreinamentos = "";

  for (const t of treinamentos) {

    const bloco = `

━━━━━━━━━━━━━━━
TREINAMENTO
━━━━━━━━━━━━━━━

Título: ${t.title}

${t.content}

`;

    if (
      memoriaTreinamentos.length +
      bloco.length >
      15000
    ) {
      break;
    }

    memoriaTreinamentos += bloco;
  }

  console.log("================================");
  console.log("TREINAMENTOS CARREGADOS");
  console.log("================================");
  console.log("TOTAL:");
  console.log(treinamentos.length);
  console.log("CARACTERES:");
  console.log(memoriaTreinamentos.length);

  return memoriaTreinamentos;
};
