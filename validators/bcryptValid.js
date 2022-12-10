const bcrypt = require("bcryptjs");

module.exports.hashPass = async (password) => {
  const hash = await bcrypt.hash(password, 10);
  return hash;
};
module.exports.comparePass = async (password, hash) => {
  const res = await bcrypt.compare(password, hash);
  if (!res) return false;
  return true;
};
