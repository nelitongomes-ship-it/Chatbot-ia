module.exports = function normalizarTelefone(phone) {
  return phone
    .replace("@c.us", "")
    .replace(/\D/g, "");
};
