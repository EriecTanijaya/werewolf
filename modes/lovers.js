const util = require("../util");

const getData = () => {
  const data = {
    id: "4",
    name: "🏹❤️ Lovers",
    description: "Setengah dari penduduk kota Bedburg akan memiliki pasangan. Yang memiliki pasangan dapat menang dengan sesama pemain yang memiliki pasangan dan dapat menang bersama pasangannya walaupun berbeda role. Jika pasanganmu mati, ",
    naration: "🧛 Kota Bedburg telah disusupi Vampire! Para warga harus menyelamatkan kota ini dari serbuan Vampire!"
  };
  return data;
};

const generate = playersLength => {
  let roles = ["vampire", "vampire-hunter", "doctor", "lookout", "mayor"];

  const townSupports = ["escort", "retributionist"];

  roles.push(util.random(townSupports));

  roles.push("vampire", "investigator", "vigilante", "vampire");

  const townProtectors = ["doctor", "bodyguard"];
  roles.push(util.random(townProtectors));

  roles.push("vampire");
  
  roles.push("jester");
  
  roles.push(util.random(townSupports));

  const randomTowns = [
    "doctor",
    "bodyguard",
    "investigator",
    "lookout",
    "sheriff",
    "vigilante",
    "escort",
    "retributionist",
    "tracker",
    "psychic",
    "villager"
  ];
  
  roles.push(util.random(randomTowns));

  roles.length = playersLength;

  roles = util.shuffleArray(roles);
  
  return roles;
};

module.exports = {
  getData,
  generate
};
