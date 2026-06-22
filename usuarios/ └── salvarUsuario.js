module.exports = async function salvarUsuario({
  prisma,
  phone
}) {

  console.log("ANTES DO USER");

  try {

    const usuario =
      await prisma.user.findFirst({
        where: {
          phone
        }
      });

    console.log(
      "USUARIO ENCONTRADO:"
    );
    console.log(usuario);

    if (!usuario) {

      await prisma.user.create({
        data: {
          phone
        }
      });

      console.log(
        "USUARIO CRIADO"
      );
    }

    return true;

  } catch (erro) {

    console.log(
      "ERRO USER:"
    );
    console.log(erro);

    return false;
  }

};
