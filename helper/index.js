module.exports = {
  getModeList: function() {
    let modeList = [
      "vampire",
      "chaos",
      "classic",
      "survive",
      "killing-wars",
      "who's-there",
      "trust-issue"
    ];
    return modeList;
  },

  getVampireRoleSet: function(playersLength) {
    /// step
    /*
    ww, town, town, town, town, neutral, town, ww, town, neutral, town
    ww, town, neutral, town
    */

    let roles = ["vampire", "vampire-hunter", "doctor", "lookout", "lookout"];

    let townSupports = ["escort", "retributionist"];
    let townSupport = this.random(townSupports);
    roles.push(townSupport);

    roles.push("vampire", "seer", "vigilante", "vampire");

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
    let roles = [
      "alpha-werewolf",
      "doctor",
      "seer",
      "escort",
      "jester",
      "lookout",
      "werewolf-cub",
      "sheriff",
      "executioner"
    ];

    let townKillings = ["veteran", "vigilante"];
    let townKilling = this.random(townKillings);
    roles.push(townKilling);

    let remainingTowns = [
      "doctor",
      "bodyguard",
      "seer",
      "lookout",
      "sheriff",
      "vigilante",
      "escort"
    ];

    let randomTown = this.random(remainingTowns);
    roles.push(randomTown);

    roles.push("serial-killer");

    roles.push("framer");

    let anotherRandomTown = this.random(remainingTowns);
    roles.push(anotherRandomTown);

    let lastRandomTown = this.random(remainingTowns);
    roles.push(lastRandomTown);

    roles.length = playersLength;

    roles = this.shuffleArray(roles);

    return roles;
  },

  getChaosRoleSet: function(playersLength) {
    let roles = [];

    let townNeedCount = Math.round(playersLength / 2) + 1;
    let badNeedCount = playersLength - townNeedCount;
    let werewolfNeedCount = Math.round((45 / 100) * badNeedCount);

    if (werewolfNeedCount > 4) {
      werewolfNeedCount = 4;
    }

    let neutralNeedCount = badNeedCount - werewolfNeedCount;

    let needSheriff = false;
    let needVampireHunter = false;
    let needVigilante = true;
    let needSpy = true;

    if (werewolfNeedCount > 3) {
      needSpy = true;
    }

    // always
    roles.push("alpha-werewolf");
    werewolfNeedCount--;
    let werewolves = [
      "werewolf-cub",
      "framer",
      "consort",
      "disguiser",
      "sorcerer"
    ];
    werewolves = this.shuffleArray(werewolves);

    let uniqueTowns = ["veteran"];
    let towns = [
      "seer",
      "doctor",
      "lookout",
      "escort",
      "retributionist",
      "tracker",
      "bodyguard"
    ];
    towns = this.shuffleArray(towns);

    let neutrals = [
      "vampire",
      "serial-killer",
      "arsonist",
      "executioner",
      "jester",
      "survivor"
    ];
    neutrals = this.shuffleArray(neutrals);

    for (let i = 0; i < werewolfNeedCount; i++) {
      roles.push(werewolves[i]);
      needVigilante = true;
    }

    for (let i = 0; i < neutralNeedCount; i++) {
      roles.push(neutrals[i]);
      if (neutrals[i] === "vampire") needVampireHunter = true;
      if (neutrals[i] === "serial-killer") needSheriff = true;
    }

    if (needSheriff) {
      roles.push("sheriff");
      townNeedCount--;
    }

    if (needVigilante) {
      roles.push("vigilante");
      townNeedCount--;
    }

    if (needVampireHunter) {
      roles.push("vampire-hunter");
      townNeedCount--;
    }

    if (needSpy) {
      roles.push("spy");
      townNeedCount--;
    }

    // unique town roles
    if (townNeedCount > 0) {
      for (let i = 0; i < uniqueTowns.length; i++) {
        roles.push(uniqueTowns[i]);
        townNeedCount--;
      }
    }

    for (let i = 0; i < townNeedCount; i++) {
      roles.push(towns[i]);
      towns = this.shuffleArray(towns); // experimental
    }

    roles = this.shuffleArray(roles);

    return roles;
  },

  getSurviveRoleSet: function(playersLength) {
    let roles = ["seer", "seer", "alpha-werewolf"];

    let survivorNeededCount = playersLength - 3;

    for (let i = 0; i < survivorNeededCount; i++) {
      roles.push("survivor");
    }

    roles = this.shuffleArray(roles);
    return roles;
  },

  getKillingWarsRoleSet: function(playersLength) {
    let werewolves = ["sorcerer", "disguiser", "consort"];
    let roles = [
      "alpha-werewolf",
      "werewolf-cub",
      "jester",
      "serial-killer",
      "survivor",
      "arsonist",
      "sorcerer",
      "serial-killer"
    ];

    roles.push(this.random(werewolves));
    roles.push("arsonist");
    roles.push("jester");
    roles.push(this.random(werewolves));
    roles.push("serial-killer");
    roles.push(this.random(werewolves));
    roles.push("survivor");

    roles.length = playersLength;
    roles = this.shuffleArray(roles);
    return roles;
  },

  getWhosThereRoleSet: function(playersLength) {
    let roles = [
      "alpha-werewolf",
      "escort",
      "escort",
      "sheriff",
      "serial-killer",
      "escort",
      "escort",
      "werewolf-cub",
      "vigilante",
      "sheriff",
      "serial-killer",
      "escort",
      "vigilante",
      "sheriff",
      "escort"
    ];

    roles.length = playersLength;
    roles = this.shuffleArray(roles);
    return roles;
  },

  getTrustIssueRoleSet: function(playersLength) {
    let roles = [
      "alpha-werewolf",
      "executioner",
      "seer",
      "seer",
      "sheriff",
      "werewolf-cub",
      "sheriff",
      "framer",
      "seer",
      "sheriff",
      "framer",
      "seer",
      "sheriff",
      "seer",
      "sheriff"
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
    let text = "Bot semi automatic yang ada campuran elemen dari ";
    text += "Town Of Salem dan Werewolf Board Game. ";
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
          main: "#202b58",
          secondary: "#202b58",
          background: "#121212",
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
    for (
      let i = 0;
      i < array.length;
      i++ //select element (current element)
    ) {
      for (
        let j = i;
        j < array.length;
        j++ //loop through next elements in array to compare calculate frequency of current element
      ) {
        if (array[i] == array[j])
          //see if element occurs again in the array
          m++; //increment counter if it does
        if (mf < m) {
          //compare current items frequency with maximum frequency
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
