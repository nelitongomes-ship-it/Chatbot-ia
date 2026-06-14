async function processarAgendamentoNatural({
  message,
  phone,
  prisma,
  sendMessage
})



//// =====================================================
// AGENDAMENTO NATURAL IA
// =====================================================

const texto = message.toLowerCase();
const ehAgendamento =

texto.includes("agendar") ||
texto.includes("agende") ||
texto.includes("marcar") ||
texto.includes("marque") ||
texto.includes("compromisso") ||
texto.includes("reunião") ||
texto.includes("reuniao") ||
texto.includes("lembrar") ||
texto.includes("lembre") ||
texto.includes("lembrete")

if (ehAgendamento) {

console.log("📅 ENTROU NO AGENDAMENTO");

//
// try {

const numeroCliente =  
  phone;

//
const clienteAgenda =
await prisma.client.findFirst({
where: {
phone: numeroCliente
}
});

const usuarioAgenda =
await prisma.user.findFirst({
where: {
phone: numeroCliente
}
});

if (!clienteAgenda && !usuarioAgenda) {

console.log(
"❌ CLIENTE/USUÁRIO NÃO ENCONTRADO:",
numeroCliente
);

return res.sendStatus(200);
}

console.log(
"✅ CLIENTE OU USUÁRIO ENCONTRADO"
);

//
const dataBrasil =
new Date()
.toLocaleDateString("pt-BR",
{
timeZone:
"America/Sao_Paulo"
}
);
//
console.log(
"📅 DATA BRASIL:",
dataBrasil
);

const extracao =  
  await axios.post(  
    "https://api.openai.com/v1/chat/completions",  
    {  
      model: "gpt-4o-mini",  
      messages: [  
        {  
          role: "system",  
          content: `Hoje é ${dataBrasil}.

Extraia data, hora e descrição.

REGRAS:

Se houver "hoje", use ${dataBrasil}

Se não houver data, use ${dataBrasil}

Se houver "amanhã", use o próximo dia

Hora sempre HH:MM

Retorne SOMENTE JSON


Formato:

{
"data":"${dataBrasil}",
"hora":"14:00",
"descricao":"Compromisso"
}  },   {   role: "user",   content: message   }   ],   temperature: 0   },   {   headers: {   Authorization:  Bearer ${process.env.OPENAI_API_KEY}`,
"Content-Type":
"application/json"
}
}
);

let respostaIA =  
  extracao.data.choices[0].message.content  
    .trim();  

respostaIA = respostaIA  
  .replace(/```json/g, "")  
  .replace(/```/g, "")  
  .trim();  

console.log(  
  "🤖 RESPOSTA IA:",  
  respostaIA  
);  

let dadosAgenda;

try {

const json =  
    respostaIA.match(/\{[\s\S]*\}/);  

  if (!json) {  
    throw new Error(  
      "JSON não encontrado"  
    );  
  }  

  dadosAgenda =  
    JSON.parse(json[0]);

if (!dadosAgenda.data) {

console.log(
"📅 SEM DATA INFORMADA - USANDO DATA DE HOJE"
);

dadosAgenda.data = dataBrasil;
}
} catch (erroJson) {

console.log(  
    "❌ ERRO JSON:",  
    erroJson  
  );  

  await sendMessage(  
    phone,  
    "❌ Não consegui entender a data e horário do compromisso."  
  );  

  return res.sendStatus(200);  
}  

if (  
  texto.includes("hoje")  
) {  
  dadosAgenda.data =  
    dataBrasil;  
}  

if (!dadosAgenda.data) {  
  dadosAgenda.data =  
    dataBrasil;  
}  

if (!dadosAgenda.hora) {  
  dadosAgenda.hora =  
    "09:00";  
}  

if (!dadosAgenda.descricao) {  
  dadosAgenda.descricao =  
    "Compromisso agendado";  
}  

dadosAgenda.descricao =  
  dadosAgenda.descricao.trim();  

console.log(  
  "📋 DADOS EXTRAIDOS:",  
  dadosAgenda  
);  

const compromissoExistente =  
  await prisma.appointment.findFirst({  
    where: {  
      phone: numeroCliente,  
      date: dadosAgenda.data,  
      time: dadosAgenda.hora  
    }  
  });  

if (compromissoExistente) {  

  console.log(  
    "⚠️ COMPROMISSO DUPLICADO"  
  );  

  await sendMessage(  
    phone,  
    `⚠️ Já existe um compromisso agendado para ${dadosAgenda.data} às ${dadosAgenda.hora}.`  
  );  

  return res.sendStatus(200);  
}

//try//
try {
//alterado//
const nomeCliente =
clienteAgenda?.name ||
usuarioAgenda?.name ||
"Usuário";
console.log("NOME CLIENTE:");
console.log(nomeCliente);

const novoCompromisso =
await prisma.appointment.create({
data: {
clientName: nomeCliente,

phone: numeroCliente,  

  date: dadosAgenda.data,  

  time: dadosAgenda.hora,  

  description: dadosAgenda.descricao  
}

});

//fin//

console.log(  
  "✅ COMPROMISSO SALVO:",  
  novoCompromisso  
);  

await sendMessage(  
  phone,  
  `✅ Compromisso agendado com sucesso!

📅 Data: ${dadosAgenda.data}
🕒 Hora: ${dadosAgenda.hora}

📝 ${dadosAgenda.descricao}

Digite minha agenda para consultar seus compromissos.`
);

return res.sendStatus(200);

} catch (erro) {

console.log(  
  "❌ ERRO AGENDAMENTO:",  
  erro  
);  

await sendMessage(  
  phone,  
  "❌ Ocorreu um erro ao realizar o agendamento."  
);  

return res.sendStatus(200);

}
    }

module.exports = {
  processarAgendamentoNatural
};
