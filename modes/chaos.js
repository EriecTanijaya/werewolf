const util = require("../util");

const getData = () => {
  const data = {
    id: "2",
    name: "🤡🪓 Chaos",
    isShowRole: false,
    description: "Sesuai namanya, role role yang ada beneran buat chaos. ",
    naration: "🔥 Telah di curigai kota Bedburg dengan sangat banyak kriminal yang berpura pura seperti warga"
  };
  return data;
};

const generate = playersLength => {
  let roles = ["mafioso"];

  let townInvestigates = ["investigator", "lookout", "psychic", "sheriff"];
  roles.push(util.random(townInvestigates));

  let townProtectors = ["doctor", "bodyguard"];
  roles.push(util.random(townProtectors));

  let townSupports = ["escort", "retributionist", "mayor"];
  roles.push(util.random(townSupports));

  let neutralEvils = ["jester", "executioner"];
  roles.push(util.random(neutralEvils));

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

  let neutralKillings = ["serial-killer", "werewolf", "juggernaut", "plaguebearer", "arsonist"];

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

  switch (getRandomEnemy()) {
    case "neutralKilling":
      neutralKilling();
      break;

    case "mafia":
      mafia();
      break;

    case "vampire":
      vampire();
      break;
  }

  switch (getRandomEnemy()) {
    case "neutralKilling":
      addNeutralKilling();
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
        addRandomTown();
      }
      break;
  }

  addRandomTown();
  addNeutralKilling();
  addRandomTown();
  addRandomTown();

  roles.length = playersLength;
  roles = util.shuffleArray(roles);
  return roles;
};

module.exports = {
  getData,
  generate
};
