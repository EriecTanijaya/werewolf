e tel      module.exports = {
  getModeList: function() {
    let modeList = ["classic", "vampire", "chaos", "ww-vs-neutral"];
    return modeList;
  },

  getVampireRoleSet: function(playersLength) {
    /// step
    /*
    ww, town, town, town, town, neutral, town, ww, town, neutral, town
    ww, town, neutral, town
    */
    
    let towns = [
      ""
    ]

    let roles = [
      "vampire",
      "vigilante",
      "seer",
      "lookout",
      "escort"
    ];
    return roles;
  },

  getWerewolfVsNeutralRoleSet: function(playersLength) {
    /// step
    /*
    ww, town, town, town, town, neutral, town, ww, town, neutral, town
    ww, town, neutral, town
    */
    
    //ada pas butuh
    // sheriff, vigi, vh, spy
    
    // town unique
    //veteran
    
    
    let towns = [
      "seer", "doctor", "lookout", "escort", "retributionist", "tracker", 
    ];
    
    let townAddon = [
      "sheriff", "vigilante", "spy", "seer", "doctor", "lookout", "escort", "retributionist", "tracker"
    ];
        let townUnique = ["veteran"];
    
    let neutralKilling = ["serial-killer", "arsonist"];
    
    let uniqueNeutral = [];    let uniquie
    
    let roles = [
      "serial-killer",
      "vigilante",
      "veteran",
      "escort",
      "werewolf",
      "spy",
      "doctor",
      "werewolf-cub",
      "arsonist",
      "consort",
      "vampire",
      "sorcerer",
      "jester",
      "executioner",
      "disguiser"
    ];
    return roles;
  },

  getClassicRoleSet: function(playersLength) {
    let roles = ["werewolf", "seer", "doctor"];

    let townProtectors = ["bodyguard", "doctor"];
    let townProtector = this.random(townProtectors);
    roles.push(townProtector);

    let remainingRoles = [
      "lookout",
      "veteran",
      "jester",
      "escort",
      "werewolf-cub",
      "sheriff",
      "executioner",
      "retributionist"
    ];

    remainingRoles.forEach(item => {
      roles.push(item);
    })

    let werewolves = ["framer", "disguiser", "consort", "sorcerer"];
    let werewolfAddon = this.random(werewolves);
    roles.push(werewolfAddon);

    let towns = ["tracker", "spy", "vigilante"];
    towns = this.shuffleArray(towns);
    roles.push(towns[0]);

    let neutrals = ["serial-killer", "arsonist"];
    let neutralAddon = this.random(neutrals);
    roles.push(neutralAddon);

    roles.push(towns[1]);

    roles.length = playersLength;
    
    roles = this.shuffleArray(roles);

    return roles;
  },

  getChaosRoleSet: function(playersLength) {
    let roles = [];

    let townNeedCount = Math.round(playersLength / 2);
    let badNeedCount = playersLength - townNeedCount;
    let werewolfNeedCount = Math.round((45 / 100) * badNeedCount);

    if (werewolfNeedCount > 4) {
      werewolfNeedCount = 4;
    }

    let neutralNeedCount = badNeedCount - werewolfNeedCount;

    let werewolfIndex = 0;
    let neutralIndex = 0;

    let needSheriff = false;
    let needVampireHunter = false;
    let needVigilante = true;

    // always
    roles.push("werewolf");
    werewolfNeedCount--;
    let werewolves = [
      "werewolf-cub",
      "framer",
      "consort",
      "disguiser",
      "sorcerer"
    ];
    werewolves = this.shuffleArray(werewolves);

    let towns = [
      "seer",
      "doctor",
      "lookout",
      "veteran",
      "escort",
      "retributionist",
      "spy",
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

    while (werewolfNeedCount) {
      roles.push(werewolves[werewolfIndex]);
      needVigilante = true;

      werewolfIndex++;
      werewolfNeedCount--;
    }

    while (neutralNeedCount) {
      roles.push(neutrals[neutralIndex]);

      if (neutrals[neutralIndex] === "vampire") {
        needVampireHunter = true;
      }

      if (neutrals[neutralIndex] === "serial-killer") {
        needSheriff = true;
      }

      neutralIndex++;
      neutralNeedCount--;
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

    for (let i = 0; i < townNeedCount; i++) {
      roles.push(towns[i]);
    }

    return roles;
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
