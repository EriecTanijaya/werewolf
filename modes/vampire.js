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
  let townSupport = util.random(townSupports);
  roles.push(townSupport);

  roles.push("vampire", "investigator", "vigilante", "vampire");

  let townProtectors = ["doctor", "bodyguard"];
  let townProtector = util.random(townProtectors);
  roles.push(townProtector);

  roles.push("vampire");

  let anotherTownSupport = util.random(townSupports);
  roles.push(anotherTownSupport);

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
