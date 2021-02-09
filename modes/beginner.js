const util = require("../util");

const getData = () => {
  const data = {
    id: "1",
    name: "🤵👨‍🌾 Beginner",
    description: "Mode ini untuk yang belum pernah main bot ini. Untuk ganti mode bisa ketik /set mode nama mode",
    naration: "☁️ Kota Bedburg sedang diambang kehancuran, para warga harus menyelamatkan kota ini dari serangan Mafia!"
  };
  return data;
};

const generate = playersLength => {
  let roles = [
    "mafioso",
    "sheriff",
    "doctor",
    "villager",
    "villager",
    "vigilante",
    "godfather",
    "sheriff",
    "villager",
    "mafioso",
    "villager",
    "doctor",
    "villager",
    "vigilante",
    "mafioso"
  ];

  roles.length = playersLength;
  roles = util.shuffleArray(roles);
  return roles;
};

module.exports = { getData, generate };
