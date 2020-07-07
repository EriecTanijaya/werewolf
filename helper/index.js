module.exports = {
  generateCustomRoles: function(playersLength, customRoles) {
    let roles = this.shuffleArray(customRoles);
    if (roles.length > playersLength) roles.length = playersLength;
    return roles;
  },

  generateRoles: function(playersLength) {
    if (playersLength < 7) {
      let roles = [];
      let mafia = ["investigator", "mafioso", "vigilante", "jester"];
      let sk = ["serial-killer", "investigator", "doctor", "jester"];

      roles = this.random([mafia, sk]);

      roles = this.shuffleArray(roles);
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
        value: 8,
        allFriendly: true
      },
      {
        name: "mayor",
        value: 8,
        pair: ["bodyguard", "vampire", "doctor", "lookout"]
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
        value: 4,
        pair: [
          "mafioso",
          "serial-killer",
          "arsonist",
          "framer",
          "consort",
          "consigliere",
          "plaguebearer",
          "werewolf",
          "juggernaut",
          "godfather"
        ]
      },
      {
        name: "vigilante",
        value: 5,
        pair: [
          "mafioso",
          "consort",
          "consigliere",
          "framer",
          "jester",
          "werewolf",
          "juggernaut",
          "plaguebearer"
        ]
      },
      {
        name: "consigliere",
        value: -10,
        pair: [
          "serial-killer",
          "arsonist",
          "plaguebearer",
          "jester",
          "vampire",
          "werewolf",
          "juggernaut",
          "executioner"
        ]
      },
      {
        name: "godfather",
        value: -8,
        pair: ["mafioso"]
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
        pair: [
          "consort",
          "escort",
          "sheriff",
          "doctor",
          "disguiser",
          "investigator"
        ]
      },
      {
        name: "werewolf",
        value: -9,
        pair: ["sheriff", "executioner", "investigator", "bodyguard"]
      },
      {
        name: "consort",
        value: -8,
        pair: ["serial-killer", "veteran", "escort"]
      },
      {
        name: "lookout",
        value: 7,
        pair: [
          "framer",
          "consigliere",
          "mafioso",
          "disguiser",
          "consort",
          "plaguebearer",
          "arsonist"
        ]
      },
      {
        name: "escort",
        value: 5,
        pair: ["serial-killer", "consort", "veteran"]
      },
      {
        name: "retributionist",
        value: 8,
        allFriendly: true
      },
      {
        name: "arsonist",
        value: -7,
        pair: ["bodyguard", "investigator", "godfather"]
      },
      {
        name: "spy",
        value: 6,
        pair: ["framer", "disguiser", "consigliere", "consort"]
      },
      {
        name: "tracker",
        value: 7,
        allFriendly: true
      },
      {
        name: "framer",
        value: -6,
        pair: ["sheriff", "investigator"]
      },
      {
        name: "disguiser",
        value: -7,
        pair: [
          "vigilante",
          "sheriff",
          "investigator",
          "doctor",
          "serial-killer"
        ]
      },
      {
        name: "juggernaut",
        value: -8,
        allFriendly: true
      },
      {
        name: "psychic",
        value: 9,
        pair: ["jester", "executioner"]
      },
      {
        name: "guardian-angel",
        value: 0,
        allFriendly: true
      },
      {
        name: "plaguebearer",
        value: -8,
        pair: ["lookout", "tracker"]
      }
    ];

    roles = this.shuffleArray(roles);

    let measure = 0;

    let generated = ["mafioso", "sheriff"];

    let neutralLimit = 1;
    let neutralKillingLimit = 1;

    let neutral = [
      "amnesiac",
      "survivor",
      "guardian-angel",
      "jester",
      "executioner"
    ];

    let neutralKilling = [
      "arsonist",
      "serial-killer",
      "juggernaut",
      "plaguebearer",
      "werewolf"
    ];

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
          role.pair = this.shuffleArray(role.pair);
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

    generated = this.shuffleArray(generated);

    return generated;
  },

  getUpdates: function() {
    // show last 10 updates
    // header text ganti nomor aja
    // body text isi aja yg penting sama emoji apa
    // buttons, ganti aja prop data nya

    let flex_text = {};
    let flex_texts = [];
    let updates = [
      {
        version: "1.2.4 🆕", //ini yg lastest aja
        majorChanges: "⚠️ Spam prevention",
        link:
          "https://timeline.line.me/post/_dew_dlek6Q7X8WLzhe1qWvEjXko3000-cqsirfM/1159408622108073821"
      },
      {
        version: "1.2.3",
        majorChanges: "📜 New Custom mode command",
        link:
          "https://timeline.line.me/post/_dew_dlek6Q7X8WLzhe1qWvEjXko3000-cqsirfM/1159358047608073922"
      },
      {
        version: "1.2.2",
        majorChanges: "💪 Major cleanup & bugfixes",
        link:
          "https://timeline.line.me/post/_dew_dlek6Q7X8WLzhe1qWvEjXko3000-cqsirfM/1159235795708072516"
      },
      {
        version: "1.2.1",
        majorChanges: "☣️ New Plaguebearer role!",
        link:
          "https://timeline.line.me/post/_dew_dlek6Q7X8WLzhe1qWvEjXko3000-cqsirfM/1159179246308071639"
      },
      {
        version: "1.2.0",
        majorChanges: "💪 Rebase to new mechanism",
        link:
          "https://timeline.line.me/post/_dew_dlek6Q7X8WLzhe1qWvEjXko3000-cqsirfM/1159110856708070799"
      },
      {
        version: "1.1.9",
        majorChanges: "🎩 New Mayor role!",
        link:
          "https://timeline.line.me/post/_dew_dlek6Q7X8WLzhe1qWvEjXko3000-cqsirfM/1159013388808076236"
      },
      {
        version: "1.1.8",
        majorChanges: "🎞️ Rework game mode",
        link:
          "https://timeline.line.me/post/_dew_dlek6Q7X8WLzhe1qWvEjXko3000-cqsirfM/1158988006208077687"
      },
      {
        version: "1.1.7",
        majorChanges: "🕹️ Add '/gamestat' cmd",
        link:
          "https://timeline.line.me/post/_dew_dlek6Q7X8WLzhe1qWvEjXko3000-cqsirfM/1158918791608077924"
      },
      {
        version: "1.1.6",
        majorChanges: "🗡️ Nerf Vampire Hunter",
        link:
          "https://timeline.line.me/post/_dew_dlek6Q7X8WLzhe1qWvEjXko3000-cqsirfM/1158769010508073732"
      },
      {
        version: "1.1.5",
        majorChanges: "🛡️ New Bodyguard role!",
        link:
          "https://timeline.line.me/post/_dew_dlek6Q7X8WLzhe1qWvEjXko3000-cqsirfM/1158736961208072579"
      }
    ];

    updates.forEach((item, index) => {
      flex_text[index] = {
        header: {
          text: "🎉 Versi " + item.version
        },
        body: {
          text: item.majorChanges
        },
        footer: {
          buttons: [
            {
              action: "uri",
              label: "👆 check",
              data: item.link
            }
          ]
        }
      };
      flex_texts.push(flex_text[index]);
    });

    return flex_texts;
  },

  getPsychicResult: function(players, psychicIndex, isFullMoon) {
    let text = "🔮 ";

    let goodTeamList = ["villager", "guardian-angel", "amnesiac"];
    let allAlivePlayers = [];
    players.forEach((item, index) => {
      // krna di main.js, itu include juga yg will_death
      if (item.status !== "death" && index !== psychicIndex) {
        let player = {
          name: item.name,
          team: item.role.team
        };
        allAlivePlayers.push(player);
      }
    });

    if (allAlivePlayers.length === 2) {
      if (!isFullMoon) {
        text +=
          "Kota ini terlalu kecil untuk menemukan siapa yang jahat dengan akurat";
        return text;
      }
    }

    allAlivePlayers = this.shuffleArray(allAlivePlayers);

    let goodCount = 0;
    allAlivePlayers.forEach(item => {
      if (goodTeamList.includes(item.team)) {
        goodCount++;
      }
    });

    if (goodCount === 0) {
      text += "Kota ini sudah terlalu jahat untuk menemukan siapa yang baik";
      return text;
    }

    let result = [];
    let goodCountNeeded = 1;
    let evilCountNeeded = 1;

    if (!isFullMoon) {
      goodCountNeeded++;
    }

    for (let i = 0; i < allAlivePlayers.length; i++) {
      let player = allAlivePlayers[i];
      if (goodTeamList.includes(player.team)) {
        if (goodCountNeeded) {
          result.push(player.name);
          goodCountNeeded--;
        }
      } else {
        if (evilCountNeeded) {
          result.push(player.name);
          evilCountNeeded--;
        }
      }

      let totalNeeded = evilCountNeeded + goodCountNeeded;

      if (totalNeeded === 0) {
        text += "Salah satu dari " + result.join(", ");

        if (isFullMoon) {
          text += " adalah orang baik";
        } else {
          text += " adalah orang jahat";
        }

        return text;
      }

      if (i === allAlivePlayers.length - 1) {
        // ini kalau yang baik cman 1 (belum termasuk psychic itu sendiri)
        text += `Salah satu dari ${result.join(", ")} adalah orang jahat`;
        return text;
      }
    }
  },

  getInvestigatorResult: function(roleName) {
    let text = "🕵️ ";
    let pairList = [
      {
        desc: "Targetmu memiliki senjata!",
        items: ["vigilante", "veteran", "mafioso"]
      },
      { desc: "Targetmu berurusan dengan mayat!", items: ["retributionist"] },
      {
        desc: "Targetmu suka menutup diri!",
        items: ["survivor", "vampire-hunter", "psychic"]
      },
      {
        desc: "Targetmu mengetahui rahasia terbesarmu!",
        items: ["spy", "guardian-angel"]
      },
      {
        desc: "Targetmu menunggu waktu yang tepat untuk beraksi!",
        items: ["sheriff", "executioner", "werewolf"]
      },
      {
        desc: "Targetmu mungkin tidak seperti yang dilihat!",
        items: ["framer", "vampire", "jester"]
      },
      {
        desc: "Targetmu diam didalam bayangan!",
        items: ["lookout", "amnesiac"]
      },
      {
        desc: "Targetmu ahli dalam mengganggu yang lain!",
        items: ["escort", "consort"]
      },
      {
        desc: "Targetmu berlumuran darah!",
        items: ["doctor", "serial-killer", "disguiser"]
      },
      {
        desc: "Targetmu memiliki rahasia yang terpendam!",
        items: [
          "investigator",
          "consigliere",
          "mayor",
          "tracker",
          "plaguebearer"
        ]
      },
      {
        desc: "Targetmu tidak takut kotor!",
        items: ["bodyguard", "godfather", "arsonist"]
      },
      {
        desc: "Targetmu sifatnya sangat bengis!",
        items: ["juggernaut"]
      },
      {
        desc: "Targetmu adalah orang biasa",
        items: ["villager"]
      }
    ];

    for (let i = 0; i < pairList.length; i++) {
      for (let u = 0; u < pairList[i].items.length; u++) {
        if (roleName === pairList[i].items[u]) {
          text += pairList[i].desc + " Targetmu bisa jadi adalah "; //kasih \n\n ?
          pairList[i].items.forEach((item, index) => {
            text += item;
            if (index == pairList[i].items.length - 2) {
              text += " atau ";
            } else if (index != pairList[i].items.length - 1) {
              text += ", ";
            }
          });
          return text;
        }
      }
    }
  },

  getModeList: function() {
    let modeList = [
      "vampire",
      "chaos",
      "classic",
      "survive",
      "killing-wars",
      "who's-there",
      "trust-issue",
      "who-are-you",
      "new-threat",
      "clown-town",
      "amnesiac-chaos",
      "friday-13"
    ];
    return modeList;
  },

  getModeNarration: function(modeName) {
    let text = "";
    switch (modeName) {
      case "vampire":
        text =
          "🧛 Kota Bedburg telah disusupi Vampire! Para warga harus menyelamatkan kota ini dari serbuan Vampire!";
        break;

      case "chaos":
        text =
          "🔥 Telah di curigai kota Bedburg dengan sangat banyak kriminal yang berpura pura seperti warga";
        break;

      case "classic":
        text =
          "☁️ Kota Bedburg sedang diambang kehancuran, para warga harus menyelamatkan kota ini dari serangan Mafia!";
        break;

      case "survive":
        text =
          "🏳️ Telah banyak korban berjatuhan di Kota Bedburg, sehingga para warga hanya ingin tetap hidup saja";
        break;

      case "killing-wars":
        text =
          "🤵 Para warga kota Bedburg semuanya telah mati, Mafia sekarang masih tetap menghadapi ancaman dari luar";
        break;

      case "who's-there":
        text =
          "💋 Banyaknya Escort pada kota Bedburg terkadang menghambat kinerja warga untuk menangkap kriminal";
        break;

      case "trust-issue":
        text =
          "🎞️ Warga salah membunuh korban yang diduga Mafia. Ternyata mereka termakan Hoax!";
        break;

      case "who-are-you":
        text =
          "🎭 Kota Bedburg sedang diambang kehancuran yang disebabkan kebanyakan drama";
        break;

      case "new-threat":
        text =
          "🔪 Warga telah berhasil membasmi Mafia, namun ternyata masih ada sosok yang harus mereka basmi!";
        break;

      case "clown-town":
        text =
          "🃏 Kerusuhan terjadi di Kota Bedburg disebabkan oleh satu orang yang dikenal sebagai Joker";
        break;

      case "amnesiac-chaos":
        text =
          "🤕 Sejak Agen K menggunakan alat penghapus ingatan, beberapa warga menjadi lupa dengan diri mereka sendiri";
        break;

      case "friday-13":
        text =
          "🔪 Banyak warga yang hilang akhir akhir ini tanpa jejak. Diduga ada pembunuh berantai diantara para warga";
        break;

      case "custom":
        text =
          "🌙 Malam telah tiba, setiap warga kembali ke rumah masing-masing";
        break;
    }
    return text;
  },

  getAmnesiacChaos: function(playersLength) {
    let roles = ["mafioso", "amnesiac"];

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

    roles.push(this.random(randomTowns));

    let townKillings = ["veteran", "vigilante"];
    roles.push(this.random(townKillings));

    let neutralEvils = ["jester", "executioner"];
    roles.push(this.random(neutralEvils));

    roles.push("amnesiac");

    let neutralKillings = [
      "arsonist",
      "serial-killer",
      "werewolf",
      "juggernaut",
      "plaguebearer"
    ];
    roles.push(this.random(neutralKillings));

    roles.push(this.random(randomTowns));

    roles.push("godfather");

    roles.push("sheriff", "amnesiac", "jester");

    let randomMafia = ["framer", "consort", "consigliere", "disguiser"];
    roles.push(this.random(randomMafia));

    roles.push(this.random(randomTowns));

    roles.length = playersLength;
    roles = this.shuffleArray(roles);
    return roles;
  },

  getFriday13RoleSet: function(playersLength) {
    let roles = [
      "serial-killer",
      "escort",
      "veteran",
      "vigilante",
      "escort",
      "mafioso",
      "doctor",
      "consort",
      "escort",
      "sheriff",
      "consort",
      "escort",
      "consort",
      "escort"
    ];

    let neutrals = ["survivor", "amnesiac", "executioner"];
    roles.push(this.random(neutrals));

    roles.length = playersLength;
    roles = this.shuffleArray(roles);
    return roles;
  },

  getVampireRoleSet: function(playersLength) {
    /// step
    /*
    ww, town, town, town, town, neutral, town, ww, town, neutral, town
    ww, town, neutral, town
    */

    let roles = ["vampire", "vampire-hunter", "doctor", "lookout", "mayor"];

    let townSupports = ["escort", "retributionist"];
    let townSupport = this.random(townSupports);
    roles.push(townSupport);

    roles.push("vampire", "investigator", "vigilante", "vampire");

    let townProtectors = ["doctor", "bodyguard"];
    let townProtector = this.random(townProtectors);
    roles.push(townProtector);

    roles.push("vampire");

    let anotherTownSupport = this.random(townSupports);
    roles.push(anotherTownSupport);

    roles.push("jester");

    roles.push("vampire");

    roles.length = playersLength;

    roles = this.shuffleArray(roles);

    return roles;
  },

  getChaosRoleSet: function(playersLength) {
    let roles = ["mafioso"];

    let townInvestigates = ["investigator", "lookout", "psychic", "sheriff"];
    roles.push(this.random(townInvestigates));

    let townProtectors = ["doctor", "bodyguard"];
    roles.push(this.random(townProtectors));

    let townSupports = ["escort", "retributionist", "mayor"];
    roles.push(this.random(townSupports));

    let neutralEvils = ["jester", "executioner"];
    roles.push(this.random(neutralEvils));

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

    let neutralKillings = [
      "arsonist",
      "serial-killer",
      "werewolf",
      "juggernaut",
      "plaguebearer"
    ];

    let randomMafia = ["framer", "consort", "consigliere", "disguiser"];

    const getRandomEnemy = () => {
      return this.random(["neutralKilling", "mafia", "vampire"]);
    };

    const addTownInvestigate = () => {
      roles.push(this.random(townInvestigates));
    };

    const addTownKilling = () => {
      let townKillings = ["veteran", "vigilante"];
      roles.push(this.random(townKillings));
    };

    const addRandomTown = () => {
      roles.push(this.random(randomTowns));
    };

    const addNeutralKilling = () => {
      roles.push(this.random(neutralKillings));
    };

    const addMafia = () => {
      roles.push(this.random(randomMafia));
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
    roles = this.shuffleArray(roles);
    return roles;
  },

  getSurviveRoleSet: function(playersLength) {
    let roles = ["sheriff", "investigator", "godfather"];

    let survivorNeededCount = playersLength - 3;

    for (let i = 0; i < survivorNeededCount; i++) {
      roles.push("survivor");
    }

    roles = this.shuffleArray(roles);
    return roles;
  },

  getKillingWarsRoleSet: function(playersLength) {
    let mafias = ["consigliere", "disguiser", "consort"];
    let roles = [
      "godfather",
      "mafioso",
      "jester",
      "serial-killer",
      "survivor",
      "arsonist",
      "consigliere",
      "serial-killer"
    ];

    roles.push(this.random(mafias));
    roles.push("arsonist");
    roles.push("jester");
    roles.push(this.random(mafias));

    let neutralKillings = [
      "arsonist",
      "serial-killer",
      "werewolf",
      "juggernaut",
      "plaguebearer"
    ];
    roles.push(this.random(neutralKillings));

    roles.push(this.random(mafias));
    roles.push("survivor");

    roles.length = playersLength;
    roles = this.shuffleArray(roles);
    return roles;
  },

  getWhosThereRoleSet: function(playersLength) {
    let roles = [
      "escort",
      "godfather",
      "escort",
      "escort",
      "mafioso",
      "sheriff",
      "escort",
      "escort",
      "consort",
      "vigilante",
      "sheriff",
      "escort",
      "vigilante",
      "sheriff",
      "consort"
    ];

    roles.length = playersLength;
    roles = this.shuffleArray(roles);
    return roles;
  },

  getTrustIssueRoleSet: function(playersLength) {
    let roles = [
      "godfather",
      "veteran",
      "sheriff",
      "investigator",
      "framer",
      "sheriff",
      "sheriff",
      "investigator",
      "framer",
      "investigator",
      "sheriff",
      "investigator",
      "framer",
      "investigator",
      "sheriff"
    ];

    roles.length = playersLength;
    roles = this.shuffleArray(roles);
    return roles;
  },

  getWhoAreYou: function(playersLength) {
    let roles = [
      "godfather",
      "doctor",
      "bodyguard",
      "doctor",
      "investigator",
      "disguiser",
      "vigilante",
      "bodyguard",
      "sheriff",
      "disguiser",
      "bodyguard",
      "vigilante",
      "escort",
      "lookout",
      "investigator"
    ];

    roles.length = playersLength;
    roles = this.shuffleArray(roles);
    return roles;
  },

  getNewThreat: function(playersLength) {
    let neutralKillings = [
      "arsonist",
      "serial-killer",
      "werewolf",
      "juggernaut"
    ];

    let roles = [];
    roles.push(this.random(neutralKillings));

    let townInvestigates = ["investigator", "lookout"];
    roles.push(this.random(townInvestigates));

    let townProtectors = ["doctor", "bodyguard"];
    roles.push(this.random(townProtectors));

    let randomTowns = [
      "doctor",
      "bodyguard",
      "investigator",
      "lookout",
      "sheriff",
      "vigilante",
      "escort",
      "retributionist",
      "tracker"
    ];
    roles.push(this.random(randomTowns));

    roles.push(this.random(neutralKillings));

    roles.push(this.random(townProtectors));

    roles.push(this.random(randomTowns));

    roles.push(this.random(townInvestigates));

    roles.push("plaguebearer");

    roles.push(this.random(randomTowns));

    roles.push("survivor");

    roles.push(this.random(randomTowns));

    roles.push("executioner", "serial-killer", "jester");

    roles.length = playersLength;
    roles = this.shuffleArray(roles);
    return roles;
  },

  getClownTown: function(playersLength) {
    let roles = [
      "godfather",
      "jester",
      "investigator",
      "sheriff",
      "investigator",
      "framer",
      "jester",
      "investigator",
      "investigator",
      "jester",
      "investigator",
      "jester",
      "framer",
      "investigator",
      "jester"
    ];

    roles.length = playersLength;
    roles = this.shuffleArray(roles);
    return roles;
  },

  getTutorial: function() {
    let flex_texts = [];
    let flex_text = {};

    let tutorial = [
      {
        header: "🌝 Phase Malam",
        body: `Pemain personal chat dengan bot, dengan ketik '/role' untuk mengetahui role dan menggunakan skill. 
          Hingga seterusnya jika ingin menggunakan skill pc bot '/role'. Saat menggunakan skill bisa di cancel dengan ketik '/revoke'.`
      },
      {
        header: "🌤️ Phase Pagi",
        body: `Pada pagi hari akan ada berita, berita publik (berita yang di beritahu di group chat) dan berita pribadi (berita yang hanya di ketahui sendiri). 
          Berita pribadi bisa di akses dengan personal chat bot '/news'. 
          Dikarenakan bot ini tidak auto, jadi pemain perlu cek berita setiap pagi nya`
      },
      {
        header: "☝️ Phase Voting",
        body: `Para warga bisa voting, bisa cancel vote dengan ketik '/revoke', bisa ganti vote sebelum waktu habis. 
          Jika ada yang sama jumlah vote, maka system akan random salah satu dari kandidat tersebut untuk dibunuh`
      },
      {
        header: "📜 Note",
        body: `Setiap Phase ada waktu nya, waktunya tergantung dari total pemain yang hidup. Jika makin sedikit, makin cepat waktunya.
          Setiap Phase juga tidak berjalan otomatis. Itulah kenapa setiap waktu habis, salah satu dari pemain perlu ada ketik '/cek' untuk lanjutin Phase Game.`
      }
    ];

    tutorial.forEach((item, index) => {
      flex_text[index] = {
        header: {
          text: item.header
        },
        body: {
          text: item.body
        }
      };
      flex_texts.push(flex_text[index]);
    });

    return flex_texts;
  },

  getAbout: function() {
    let text = "Bot semi automatic yang terinspirasi dari ";
    text += "Town Of Salem. ";
    text +=
      "Thanks buat grup Avalon City, LOW, Where Wolf(?), Random, RND Twins dan semua adders!" +
      "\n";
    text += "- Eriec (creator)";
    let flex_text = {
      header: {
        text: "🐺 City Of Bedburg 👨‍🌾"
      },
      body: {
        text: text
      }
    };
    return flex_text;
  },

  parseToText: function(arr) {
    let text = "";
    arr.forEach(function(item, index) {
      if (index !== 0) {
        //ini untuk tidak parse text command '/command'
        if (index !== 1) {
          text += " ";
        }
        text += item;
      }
    });
    return text;
  },

  getRoleTeamEmoji: function(team) {
    const roles = require("/app/roles/rolesData");
    for (let i = 0; i < roles.length; i++) {
      if (team === roles[i].team) {
        return roles[i].emoji.team;
      }
    }
  },

  getRoleNameEmoji: function(roleName) {
    const roles = require("/app/roles/rolesData");
    for (let i = 0; i < roles.length; i++) {
      if (roleName === roles[i].name) {
        return roles[i].emoji.self;
      }
    }
  },

  cutFromArray: function(array, index) {
    for (let i = index; i < array.length - 1; i++) {
      array[i] = array[parseInt(i) + 1];
    }
    array.pop();
    return array;
  },

  resetRoom: function(group_sessions, key) {
    group_sessions[key] = null;
  },

  resetUser: function(user_sessions, key) {
    user_sessions[key] = null;
  },

  resetAllUsers: function(group_sessions, user_sessions, key) {
    group_sessions[key].players.forEach(item => {
      this.resetUser(user_sessions, item.id);
    });
    this.resetRoom(group_sessions, key);
  },

  getFlexColor: function() {
    let color = {};
    let today = new Date().toLocaleTimeString("id-ID", {
      timeZone: "Asia/Bangkok",
      hour12: false
    });
    let timestamp = {
      dawn: {
        from: "00:00:00",
        to: "03:59:59",
        color: {
          main: "#162447",
          secondary: "#162447",
          background: "#000000",
          text: "#ffffff"
        }
      },
      morning: {
        from: "04:00:00",
        to: "08:59:59",
        color: {
          main: "#5aa2e0",
          secondary: "#5aa2e0",
          background: "#ffffff",
          text: "#000000"
        }
      },
      noon: {
        from: "09:00:00",
        to: "14:59:59",
        color: {
          main: "#f8aa27",
          secondary: "#f8aa27",
          background: "#ffffff",
          text: "#263646"
        }
      },
      evening: {
        from: "15:00:00",
        to: "18:29:59",
        color: {
          main: "#f46a4e",
          secondary: "#f46a4e",
          background: "#ffffff",
          text: "#000000"
        }
      },
      night: {
        from: "18:30:00",
        to: "23:59:59",
        color: {
          main: "#004751",
          secondary: "#004751",
          background: "#272727",
          text: "#ffffff"
        }
      }
    };

    let times = Object.keys(timestamp);

    for (let i = 0; i < times.length; i++) {
      let time = timestamp[times[i]];
      if (today >= time.from && today <= time.to) {
        color = time.color;
        return color;
      }
    }
  },

  getRandomInt: function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  shuffleArray: function(array) {
    // Thanks to
    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  },

  random: function(array) {
    return array[Math.floor(Math.random() * array.length)];
  },

  trueOrFalse: function() {
    let trueOrFalse = this.random([true, false]);
    return trueOrFalse;
  },

  getMostFrequent: function(array) {
    ///source : https://stackoverflow.com/questions/31227687/find-the-most-frequent-item-of-an-array-not-just-strings
    let mf = 1; //default maximum frequency
    let m = 0; //counter
    let item; //to store item with maximum frequency
    let obj = {}; //object to return

    //select element (current element)
    for (let i = 0; i < array.length; i++) {
      //loop through next elements in array to compare calculate frequency of current element
      for (let j = i; j < array.length; j++) {
        //see if element occurs again in the array
        if (array[i] == array[j]) m++; //increment counter if it does

        //compare current items frequency with maximum frequency
        if (mf < m) {
          mf = m; //if m>mf store m in mf for upcoming elements
          item = array[i]; // store the current element.
        }
      }
      m = 0; // make counter 0 for next element.
    }

    //jika ada yang sama, maka akan pilih yang di pertama kali diisi di variable 'item'
    obj = {
      index: item,
      count: mf
    };

    return obj;
  }
};
