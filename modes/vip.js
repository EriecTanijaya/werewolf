const util = require("../util");

const getData = () => {
  const data = {
    id: "5",
    name: "⭐👨‍🌾 VIP",
    description:
      "Akan ditunjuk secara random 1 warga menjadi VIP. Setiap warga mengetahui siapa VIP nya. Jika VIP mati, maka warga akan kalah. Role Bodyguard dan Vigilante tidak bisa menjadi VIP.",
    naration: "⭐ Mafia memiliki misi untuk membunuh VIP warga, tentunya setiap warga tidak akan membiarkan itu terjadi"
  };
  return data;
};

const generate = playersLength => {
  const townSupports = ["escort", "mayor", "retributionist"];
  const townProtectors = ["doctor", "bodyguard"];
  const neutrals = ["amnesiac", "survivor", "jester"];

  let roles = ["mafioso", "sheriff", "vigilante", "doctor"];
  roles.push(util.random(townSupports));
  roles.push("guardian-angel");
  roles.push("godfather");
  roles.push(util.random(townProtectors));
  roles.push(util.random(neutrals));
  roles.push("consort", "tracker", "bodyguard", "psychic", "consigliere");
  roles.push(util.random(townProtectors));

  roles.length = playersLength;
  roles = util.shuffleArray(roles);
  return roles;
};

module.exports = { getData, generate };
