const util = require("../util");

const getData = () => {
  const data = {
    id: "2",
    name: "🤡🪓 Chaos",
    description: "Sesuai namanya, role role yang ada beneran buat chaos",
    naration: "🔥 Telah di curigai kota Bedburg dengan sangat banyak kriminal yang berpura pura seperti warga"
  };
  return data;
};

const generate = playersLength => {
  let roles = ["mafioso"];

  const townInvestigates = ["investigator", "lookout", "psychic", "sheriff"];
  roles.push(util.random(townInvestigates));

  const townProtectors = ["doctor", "bodyguard"];
  roles.push(util.random(townProtectors));

  const townSupports = ["escort", "retributionist", "mayor"];
  roles.push(util.random(townSupports));

  const neutrals = ["jester", "executioner", "guardian-angel", "amnesiac", "survivor"];

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
    "psychic"
  ];

  let neutralKillings = ["serial-killer", "werewolf", "juggernaut", "arsonist"];

  let randomMafia = ["framer", "consort", "consigliere", "disguiser"];

  const getRandomEnemy = () => {
    return util.random(["neutralKilling", "mafia", "vampire"]);
  };

  const addTownInvestigate = () => {
    roles.push(util.random(townInvestigates));
  };

  const addTownKilling = () => {
    let townKillings = ["veteran", "vigilante"];
    roles.push(util.random(townKillings));
  };

  const addRandomTown = () => {
    roles.push(util.random(randomTowns));
  };

  const addNeutralKilling = () => {
    roles.push(util.random(neutralKillings));
  };

  const addNeutral = () => {
    roles.push(util.random(neutrals));
  };

  const addMafia = () => {
    roles.push(util.random(randomMafia));
  };

  const addVampire = () => {
    roles.push("vampire");
  };

  const neutralKilling = () => {
    addNeutralKilling();
    addTownInvestigate();
    addTownKilling();
    addNeutralKilling();
  };

  const mafia = () => {
    roles.push("godfather");
    addTownInvestigate();
    addTownKilling();
    addMafia();
  };

  const vampire = () => {
    addVampire();
    roles.push("vampire-hunter");
    isVampireHunterAdded = true;
    addTownInvestigate();
    addVampire();
  };

  let isVampireHunterAdded = false;
  let isNeutralKilling = false;
  let isVampire = false;

  addNeutral();

  switch (getRandomEnemy()) {
    case "neutralKilling":
      isNeutralKilling = true;
      neutralKilling();
      break;

    case "mafia":
      mafia();
      break;

    case "vampire":
      isVampire = true;
      vampire();
      break;
  }

  switch (getRandomEnemy()) {
    case "neutralKilling":
      if (isNeutralKilling) {
        roles.push("plaguebearer");
      } else {
        isNeutralKilling = true;
        addNeutralKilling();
      }
      addRandomTown();
      break;

    case "mafia":
      addMafia();
      roles.push("spy");
      break;

    case "vampire":
      addVampire();
      if (!isVampireHunterAdded) {
        roles.push("vampire-hunter");
      } else {
        if (isVampire) {
          addTownKilling();
        } else {
          addRandomTown();
        }
      }
      break;
  }

  addRandomTown();

  if (isNeutralKilling) {
    addNeutral();
  } else {
    addNeutralKilling();
  }

  addRandomTown();
  addRandomTown();

  roles.length = playersLength;
  roles = util.shuffleArray(roles);
  return roles;
};

module.exports = { getData, generate };
