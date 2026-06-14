module.exports = function validarTexto(texto) {

  if (!texto) {
    return false;
  }

  if (typeof texto !== "string") {
    return false;
  }

  if (texto.trim().length === 0) {
    return false;
  }

  return true;
};
