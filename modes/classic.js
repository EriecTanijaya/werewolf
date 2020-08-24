const util = require("../util");

const getData = () => {
  const data = {
    id: "1",
    name: "👨‍🌾🤵 Classic",
    isShowRole: true,
    description: "Mode normal, cocok untuk pemula. Bisa juga tweak dengan '/set show_role no' agar lebih menantank",
    naration: "☁️ Kota Bedburg sedang diambang kehancuran, para warga harus menyelamatkan kota ini dari serangan Mafia!"
  };
  return data;
};

const generate = playersLength => {
  if (playersLength < 7) {
    let roles = [];
    let mafia = ["investigator", "mafioso", "vigilante", "jester"];
    let sk = ["serial-killer", "investigator", "doctor", "jester"];

    roles = util.random([mafia, sk]);

    roles = util.shuffleArray(roles);
    return roles;
  }

  let roles = [
    {
      name: "bodyguard",
      value: 4,
      allFriendly: true
    },
    {
      name: "doctor",
      value: 4,
      allFriendly: true
    },
    {
      name: "investigator",
      value: 6,
      allFriendly: true
    },
    {
      name: "mayor",
      value: 8,
      pair: ["bodyguard", "doctor", "lookout", "investigator", "consigliere", "tracker"]
    },
    {
      name: "sheriff",
      value: 7,
      pair: [
        "mafioso",
        "framer",
        "disguiser",
        "consort",
        "consigliere",
        "serial-killer",
        "executioner",
        "werewolf",
        "investigator"
      ]
    },
    {
      name: "survivor",
      value: 0,
      allFriendly: true
    },
    {
      name: "veteran",
      value: 3,
      allFriendly: true
    },
    {
      name: "vigilante",
      value: 5,
      pair: ["mafioso", "consort", "consigliere", "framer", "jester", "disguiser", "veteran"]
    },
    {
      name: "consigliere",
      value: -10,
      pair: ["sheriff", "investigator", "mayor", "tracker", "plaguebearer"]
    },
    {
      name: "godfather",
      value: -8,
      pair: ["mafioso", "bodyguard", "arsonist"]
    },
    {
      name: "mafioso",
      value: -6,
      allFriendly: true
    },
    {
      name: "amnesiac",
      value: 0,
      allFriendly: true
    },
    {
      name: "executioner",
      value: -4,
      allFriendly: true
    },
    {
      name: "jester",
      value: -1,
      allFriendly: true
    },
    {
      name: "serial-killer",
      value: -8,
      pair: ["consort", "escort", "sheriff", "doctor", "disguiser", "investigator"]
    },
    {
      name: "werewolf",
      value: -9,
      pair: ["sheriff", "executioner", "investigator", "bodyguard"]
    },
    {
      name: "consort",
      value: -10,
      pair: ["serial-killer", "veteran", "escort", "investigator"]
    },
    {
      name: "lookout",
      value: 7,
      allFriendly: true
    },
    {
      name: "escort",
      value: 5,
      pair: ["serial-killer", "veteran", "escort", "investigator"]
    },
    {
      name: "retributionist",
      value: 8,
      allFriendly: true
    },
    {
      name: "arsonist",
      value: -8,
      pair: ["bodyguard", "godfather", "investigator"]
    },
    {
      name: "spy",
      value: 7,
      pair: ["framer", "disguiser", "consigliere", "consort"]
    },
    {
      name: "tracker",
      value: 7,
      allFriendly: true
    },
    {
      name: "framer",
      value: -7,
      pair: ["sheriff", "investigator"]
    },
    {
      name: "disguiser",
      value: -8,
      pair: ["sheriff", "investigator", "doctor", "serial-killer", "psychic"]
    },
    {
      name: "juggernaut",
      value: -8,
      allFriendly: true
    },
    {
      name: "psychic",
      value: 8,
      pair: ["jester", "executioner", "disguiser"]
    },
    {
      name: "guardian-angel",
      value: 0,
      allFriendly: true
    },
    {
      name: "plaguebearer",
      value: -8,
      allFriendly: true
    }
  ];

  roles = util.shuffleArray(roles);

  let measure = 0;

  let generated = ["mafioso", "sheriff"];

  let neutralLimit = 1;
  let neutralKillingLimit = 1;

  let neutral = ["amnesiac", "survivor", "guardian-angel", "jester", "executioner"];

  let neutralKilling = ["arsonist", "serial-killer", "juggernaut", "plaguebearer", "werewolf"];

  for (let i = 0; i < roles.length; i++) {
    if (generated.length === playersLength) break;

    let role = roles[i];

    for (let u = 0; u < generated.length; u++) {
      if (generated.length === playersLength) break;

      if (role.allFriendly) {
        if (!generated.includes(role.name)) {
          let currentMeasure = measure;
          if (currentMeasure < -4) {
            if (role.value < 5) continue;
          } else if (currentMeasure > 4) {
            if (role.value > 4) continue;
          }

          if (neutral.includes(role.name)) {
            if (neutralLimit) {
              neutralLimit--;
            } else {
              continue;
            }
          }

          if (neutralKilling.includes(role.name)) {
            if (neutralKillingLimit) {
              neutralKillingLimit--;
            } else {
              continue;
            }
          }

          generated.push(role.name);
          measure += role.value;
        }
      } else {
        role.pair = util.shuffleArray(role.pair);
        for (let j = 0; j < role.pair.length; j++) {
          if (generated.length === playersLength) break;

          if (generated[u] === role.pair[j]) {
            if (!generated.includes(role.name)) {
              let currentMeasure = measure;
              if (currentMeasure < -4) {
                if (role.value < 5) continue;
              } else if (currentMeasure > 4) {
                if (role.value > 4) continue;
              }

              if (neutral.includes(role.name)) {
                if (neutralLimit) {
                  neutralLimit--;
                } else {
                  continue;
                }
              }

              if (neutralKilling.includes(role.name)) {
                if (neutralKillingLimit) {
                  neutralKillingLimit--;
                } else {
                  continue;
                }
              }

              generated.push(role.name);
              measure += role.value;

              break;
            }
          }
        }
      }
    }
  }

  if (measure > 10) {
    generated.pop();
    generated.push("villager");
  }

  // console.log(`generated role : ${generated.join(", ")}`);
  // console.log(`measure point : ${measure}`);

  generated = util.shuffleArray(generated);

  return generated;
};

module.exports = {
  getData,
  generate
};
