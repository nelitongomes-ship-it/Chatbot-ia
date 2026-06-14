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
