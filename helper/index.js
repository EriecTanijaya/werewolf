module.exports = {
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

    if (!isFullMoon) goodCountNeeded++;

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
    switch(modeName) {
      case "vampire":
        text = "🧛 Kota Bedburg telah disusupi Vampire! Para warga harus menyelamatkan kota ini dari serbuan Vampire!";
        break;
        
      case "chaos":
        text = "🔥 Telah di curigai kota Bedburg dengan sangat banyak kriminal yang berpura pura seperti warga";
        break;
        
      case "classic":
        text = "☁️ Kota Bedburg sedang diambang kehancuran, para warga harus menyelamatkan kota ini dari serangan Mafia!";
        break;
        
      case "survive":
        text = "🏳️ Telah banyak korban berjatuhan di Kota Bedburg, sehingga para warga hanya ingin tetap hidup saja";
        break;
        
      case "killing-wars":
        text = "🤵 Para warga kota Bedburg semuanya telah mati, Mafia sekarang masih tetap menghadapi ancaman dari luar";
        break;
        
      case "who's-there":
        text = "💋 Banyaknya Escort pada kota Bedburg terkadang menghambat kinerja warga untuk menangkap kriminal";
        break;
        
      case "trust-issue":
        text = "🎞️ Warga salah membunuh korban yang diduga Mafia. Ternyata mereka termakan Hoax!";
        break
        
      case "who-are-you":
        text = "🎭 Kota Bedburg sedang diambang kehancuran yang disebabkan kebanyakan drama";
        break;
        
      case "new-threat":
        text = "🔪 Warga telah berhasil membasmi Mafia, namun ternyata masih ada sosok yang harus mereka basmi!";
        break;
        
      case "clown-town":
        text = "🃏 Kerusuhan terjadi di Kota Bedburg disebabkan oleh satu orang yang dikenal sebagai Joker";
        break;
        
      case "amensiac-chaos":
        text = "🤕 Sejak Agen K menggunakan alat penghapus ingatan, beberapa warga menjadi lupa dengan diri mereka sendiri";
        break;
        
      case "friday-13":
        text = "🔪 Banyak warga yang hilang akhir akhir ini tanpa jejak. Diduga ada pembunuh berantai diantara para warga";
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
      "escort",
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

  getClassicRoleSet: function(playersLength) {
    let roles = ["mafioso", "doctor", "sheriff", "escort", "jester"];

    let townKillings = ["veteran", "vigilante"];
    let townKilling = this.random(townKillings);
    roles.push(townKilling);

    roles.push("godfather", "investigator", "executioner", "lookout");

    let remainingTowns = [
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

    let randomTown = this.random(remainingTowns);
    roles.push(randomTown);

    let neutralKillings = [
      "arsonist",
      "serial-killer",
      "werewolf",
      "juggernaut",
      "plaguebearer"
    ];
    roles.push(this.random(neutralKillings));

    roles.push("framer", "spy");

    let lastRandomTown = this.random(remainingTowns);
    roles.push(lastRandomTown);

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

    roles.push("godfather");

    roles.push(this.random(townInvestigates));

    let townKillings = ["veteran", "vigilante"];
    roles.push(this.random(townKillings));

    let randomMafia = ["framer", "consort", "consigliere", "disguiser"];
    roles.push(this.random(randomMafia));

    let neutralKillings = [
      "arsonist",
      "serial-killer",
      "werewolf",
      "juggernaut",
      "plaguebearer"
    ];
    roles.push(this.random(neutralKillings));

    roles.push("spy");

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

    roles.push(this.random(randomTowns));

    roles.push(this.random(randomTowns));

    roles.push(this.random(randomMafia));

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

    let neutrals;
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
        //color = time.color;
        /// Black lives matter
        color = {
          main: "#0f4c75",
          secondary: "#0f4c75",
          background: "#000000",
          text: "#ffffff"
        };

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
