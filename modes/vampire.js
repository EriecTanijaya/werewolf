const util = require("../util");

const getData = () => {
  const data = {
    id: "3",
    name: "🦇🧛 Vampire",
    isShowRole: true,
    description: "Disana Vampire, disini Vampire, dimana mana ada Vampire.",
    naration:
      "🧛 Kota Bedburg telah disusupi Vampire! Para warga harus menyelamatkan kota ini dari serbuan Vampire!"
  };
  return data;
};

const generate = playersLength => {
  let roles = ["vampire", "vampire-hunter", "doctor", "lookout", "mayor"];

  let townSupports = ["escort", "retributionist"];

  roles.push(util.random(townSupports));

  roles.push("vampire", "investigator", "vigilante", "vampire");

  let townProtectors = ["doctor", "bodyguard"];
  roles.push(util.random(townProtectors));

  roles.push("vampire");

  let randomTowns = [
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

  roles.push("jester");

  roles.push("vampire");

  roles.length = playersLength;

  roles = util.shuffleArray(roles);

  return roles;
};

module.exports = {
  getData,
  generate
};
