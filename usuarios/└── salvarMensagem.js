module.exports = async function salvarMensagem({
  prisma,
  phone,
  role,
  content
}) {

  await prisma.message.create({
    data: {
      phone,
      role,
      content
    }
  });

  return true;
};
