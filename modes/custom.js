const util = require("../util");

const getData = () => {
  const data = {
    id: "custom",
    name: "🤵🔥 Custom",
    isShowRole: true,
    description:
      "Mode Custom bisa diatur dengan '/set role'",
    naration: "🌙 Malam telah tiba, setiap warga kembali ke rumah masing-masing"
  };
  return data;
};

const generate = (playersLength, customRoles) => {
  const roles = util.shuffleArray(customRoles);
  if (roles.length > playersLength) roles.length = playersLength;
  return roles;
};

module.exports = {
  getData,
  generate
};
