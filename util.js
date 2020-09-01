const client = require("./src/client");
const roles = require("./roles");

const getUpdates = () => {
  // show last 10 updates
  // header text ganti nomor aja
  // body text isi aja yg penting sama emoji apa
  // buttons, ganti aja prop data nya

  const baseUrl = "https://line.me/R/home/public/post?id=218mdfal&postId=";
  let flex_text = {};
  let flex_texts = [];
  let updates = [
    {
      version: "1.3.7 🆕", //ini yg lastest aja
      majorChanges: "🎩 Bug fix & mode tweak",
      postId: "1159883467008077998"
    },
    {
      version: "1.3.6",
      majorChanges: "🔥 Adjustment & Buff",
      postId: "1159828033008074107"
    },
    {
      version: "1.3.5",
      majorChanges: "😇 Role changes",
      postId: "1159771303308074463"
    },
    {
      version: "1.3.0",
      majorChanges: "📜 Rewrite bot",
      postId: "1159530099008079190"
    },
    {
      version: "1.2.4",
      majorChanges: "⚠️ Spam prevention",
      postId: "1159408622108073821"
    },
    {
      version: "1.2.3",
      majorChanges: "📜 New Custom mode command",
      postId: "1159358047608073922"
    },
    {
      version: "1.2.2",
      majorChanges: "💪 Major cleanup & bugfixes",
      postId: "1159235795708072516"
    },
    {
      version: "1.2.1",
      majorChanges: "☣️ New Plaguebearer role!",
      postId: "1159179246308071639"
    },
    {
      version: "1.2.0",
      majorChanges: "💪 Rebase to new mechanism",
      postId: "1159110856708070799"
    },
    {
      version: "1.1.9",
      majorChanges: "🎩 New Mayor role!",
      postId: "1159013388808076236"
    }
  ];

  updates.forEach((item, index) => {
    flex_text[index] = {
      headerText: "🎉 Versi " + item.version,
      bodyText: item.majorChanges,
      buttons: [
        {
          action: "uri",
          label: "👆 Check",
          data: baseUrl + item.postId
        }
      ]
    };
    flex_texts.push(flex_text[index]);
  });

  return flex_texts;
};

const getMostFrequent = array => {
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
};

const cutFromArray = (array, index) => {
  for (let i = index; i < array.length - 1; i++) {
    array[i] = array[parseInt(i) + 1];
  }
  array.pop();
  return array;
};

const getGroupId = event => {
  if (event.source.type === "group") {
    return event.source.groupId;
  } else if (event.source.type === "room") {
    return event.source.roomId;
  }
};

const getForumInfo = () => {
  const flex_text = {
    headerText: "💬 Forum",
    bodyText: "Gabung ke forum untuk tahu berita tentang bot!",
    buttons: [
      {
        action: "uri",
        label: "🚪 Open forum",
        data:
          "https://line.me/ti/g2/3NEqw4h7jNdOBCur8AQWyw?utm_source=invitation&utm_medium=link_copy&utm_campaign=default"
      }
    ]
  };
  return flex_text;
};

const getTutorial = () => {
  const flex_texts = [
    {
      headerText: "🌝 Phase Malam",
      bodyText: `Pemain personal chat dengan bot, dengan ketik '/role' untuk mengetahui role dan menggunakan skill. 
          Hingga seterusnya jika ingin menggunakan skill pc bot '/role'. Saat menggunakan skill bisa di cancel dengan ketik '/revoke'.`
    },
    {
      headerText: "🌤️ Phase Pagi",
      bodyText: `Pada pagi hari akan ada berita, berita publik (berita yang di beritahu di group chat) dan berita pribadi (berita yang hanya di ketahui sendiri). 
          Berita pribadi bisa di akses dengan personal chat bot '/news'. 
          Dikarenakan bot ini tidak auto, jadi pemain perlu cek berita setiap pagi nya`
    },
    {
      headerText: "☝️ Phase Voting",
      bodyText: `Para warga bisa voting, bisa cancel vote dengan ketik '/revoke', bisa ganti vote sebelum waktu habis. 
          Jika ada yang sama jumlah vote, maka system akan random salah satu dari kandidat tersebut untuk dibunuh`
    },
    {
      headerText: "📜 Note",
      bodyText: `Setiap Phase ada waktu nya, waktunya tergantung dari total pemain yang hidup. Jika makin sedikit, makin cepat waktunya.
          Setiap Phase juga tidak berjalan otomatis. Itulah kenapa setiap waktu habis, salah satu dari pemain perlu ada ketik '/cek' untuk lanjutin Phase Game.`
    }
  ];
  return flex_texts;
};

const getSender = () => {
  const rolesData = Object.keys(roles).map(item => {
    let { name, iconUrl } = roles[item].getData();
    let roleName = name[0].toUpperCase() + name.substring(1);
    return {
      name: roleName,
      iconUrl
    };
  });

  let { name, iconUrl } = random(rolesData);

  let sender = {
    name: name,
    iconUrl: iconUrl
  };

  return sender;
};

const getAbout = () => {
  let text = "Bot semi automatic yang terinspirasi dari ";
  text += "Town Of Salem.";
  text +=
    "\n\n" +
    "Thanks buat grup Avalon City, LOW, Where Wolf(?), Random, RND Twins, AreYouWolf? dan semua adders!" +
    "\n";
  text += "- Eriec (creator)";

  const flex_text = {
    headerText: "🐺 City Of Bedburg 👨‍🌾",
    bodyText: text
  };
  return flex_text;
};

const getHelp = state => {
  let header = "";
  let body = "";

  switch (state) {
    case "idle":
      header += "🚪 Buat room game";
      body += "Buat room game dengan perintah '/new'. ";
      body += "Di butuhkan minimal 5 pemain untuk memulai game. ";
      body += "Ketik '/help' lagi untuk bantuan.";
      break;

    case "new":
      header += "✋ Join ke dalam game";
      body += "Gunakan perintah '/join' untuk bergabung kedalam game. ";
      body += "Pemain yang telah join ke suatu room game tidak dapat join ";
      body += "ke room game tempat lain. ";
      body += "Ketik '/help' lagi untuk bantuan.";
      break;

    case "day":
      header += "⛅ Diskusi";
      body += "Jangan lupa pc bot '/news' untuk mengetahui berita hasil skill. ";
      body += "Diskusilah siapa yang akan di vote. ";
      body += "Ketik '/help' lagi untuk bantuan.";
      break;

    case "night":
      header += "🌙 Gunakan skill";
      body += "Gunakan skill dengan klik button 'role' di flex bot atau ";
      body += "pc bot dengan perintah '/role'. ";
      body += "Jika bingung info peran, bisa gunakan perintah '/info <nama-role>'. " + "\n";
      body += "Contoh : /info serial-killer. ";
      body += "Ketik '/help' lagi untuk bantuan.";
      break;

    case "vote":
      header += "☝️ Vote pemain";
      body += "Pilih pemain yang ingin digantung. ";
      body += "Voting akan selesai jika waktu yang diberikan telah habis. ";
      body += "Ketik '/help' lagi untuk bantuan.";
      break;

    case "lynch":
      header += "☠️ Penghukuman";
      body += "Jika yang dihukum adalah warga, perhatikan siapa yang vote siapa, dan biasanya dari hasil vote itu ";
      body += "bisa menemukan penjahatnya. ";
      break;

    default:
      header += "🎮 Undang Bot";
      body += "Undang bot ke group / room chat kamu untuk bermain. ";
      body += "Di butuhkan minimal 5 pemain. Untuk tutorial, ketik '/tutorial'";
  }

  let helpMessage = {
    headerText: header,
    bodyText: body
  };

  return helpMessage;
};

const leaveGroup = (event, groupId, text) => {
  return client
    .replyMessage(event.replyToken, {
      type: "text",
      text: text
    })
    .then(() => {
      if (event.source.type === "group") {
        client.leaveGroup(groupId);
      } else {
        client.leaveRoom(groupId);
      }
    });
};

const random = array => {
  return array[Math.floor(Math.random() * array.length)];
};

const getFlexColor = () => {
  const day = new Date().getDay();
  let hour = new Date().getHours();
  hour += 7;
  hour = hour > 24 ? hour - 24 : hour;
  console.log(hour)
  
  const colors = {
    light: ["#1abc9c", "#77a6f8", "#d9c06e", "#6edb6e", "#964B00", "#303030", "#b27563"],
    evening: {
      main: "#fa744f",
      background: "#fff3cd",
      text: "#222831"
    },
    dark: ["#00818a", "#303030", "#db5777", "#126D71", "#3a97d4", "#964B00", "#7c7d7c"]
  };

  if (hour < 17) {
    return {
      main: colors["light"][day],
      background: "#ffffff",
      text: "#1d1d1d"
    };
  } else if (hour >= 17 && hour < 19) {
    return colors["evening"];
  } else if (hour >= 19 && hour <= 24) {
    return {
      main: colors["dark"][day],
      background: "#1d1d1d",
      text: "#ffffff"
    };
  }

  return colors["dark"][day];
};

const getRoleNameEmoji = roleName => {
  const rolesData = Object.keys(roles);
  for (let i = 0; i < rolesData.length; i++) {
    if (roleName === rolesData[i]) {
      const { emoji } = roles[rolesData[i]].getData();
      return emoji.self;
    }
  }
};

const getRoleTeamEmoji = roleTeam => {
  const rolesData = Object.keys(roles);
  for (let i = 0; i < rolesData.length; i++) {
    const { team, emoji } = roles[rolesData[i]].getData();
    if (roleTeam === team) {
      return emoji.team;
    }
  }
};

const shuffleArray = array => {
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
};

const getPsychicResult = (players, psychicIndex, isFullMoon) => {
  let text = "🔮 ";

  const goodTeamList = ["villager", "guardian-angel", "amnesiac", "survivor"];
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
      text += "Kota ini terlalu kecil untuk menemukan siapa yang jahat dengan akurat";
      return text;
    }
  }

  allAlivePlayers = shuffleArray(allAlivePlayers);

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

    const totalNeeded = evilCountNeeded + goodCountNeeded;

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
};

const getInvestigatorResult = roleName => {
  let text = "🕵️ ";
  const pairList = [
    {
      desc: "Targetmu memiliki senjata!",
      items: ["vigilante", "veteran", "mafioso"]
    },
    { desc: "Targetmu berurusan dengan mayat!", items: ["retributionist"] },
    {
      desc: "Targetmu suka menutup diri!",
      items: ["survivor", "vampire-hunter", "psychic", "amnesiac"]
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
      items: ["lookout", "juggernaut"]
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
      items: ["investigator", "consigliere", "mayor", "tracker", "plaguebearer"]
    },
    {
      desc: "Targetmu tidak takut kotor!",
      items: ["bodyguard", "godfather", "arsonist"]
    },
    {
      desc: "Targetmu adalah orang biasa",
      items: ["villager"]
    }
  ];

  for (let i = 0; i < pairList.length; i++) {
    for (let u = 0; u < pairList[i].items.length; u++) {
      if (roleName === pairList[i].items[u]) {
        text += pairList[i].desc + " Targetmu bisa jadi adalah ";
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
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const parseToText = arr => {
  let text = "";
  arr.forEach((item, index) => {
    if (index !== 0) {
      //ini untuk tidak parse text command '/command'
      if (index !== 1) {
        text += " ";
      }
      text += item;
    }
  });
  return text;
};

const getFakeData = (length = 4) => {
  const raw = [
    {
      userId: "121212",
      name: "Jenny"
    },
    {
      userId: "408040",
      name: "Lala"
    },
    {
      userId: "969696",
      name: "Ron"
    },
    {
      userId: "555555",
      name: "Karen"
    },
    {
      userId: "789878",
      name: "Fongteng"
    },
    {
      userId: "201220",
      name: "Nasa"
    },
    {
      userId: "794821",
      name: "Tukiman"
    },
    {
      userId: "326542",
      name: "Mumu"
    },
    {
      userId: "359745",
      name: "Ken"
    },
    {
      userId: "7895135",
      name: "Jon"
    },
    {
      userId: "5659898",
      name: "Bob"
    },
    {
      userId: "7871265",
      name: "Sully"
    },
    {
      userId: "9615753",
      name: "Narto"
    },
    {
      userId: "357159",
      name: "Farah"
    }
  ];

  const data = raw.map(item => {
    const obj = {
      id: item.userId,
      name: item.name,
      state: "inactive",
      groupId: "",
      groupName: "",
      commandCount: 0,
      cooldown: 0,
      spamCount: 0
    };
    return obj;
  });

  data.length = length;
  return data;
};

const getPromotedGroup = group_sessions => {
  const flex_texts = [];
  const flex_text = {};
  let found = false;

  Object.keys(group_sessions).forEach((item, index) => {
    const { name, promoted, adminLink, caption } = group_sessions[item];

    if (promoted) {
      found = true;
      flex_text[index] = {
        headerText: `🏘️ ${name}`,
        buttons: [
          {
            action: "uri",
            label: "🗨️ Chat Admin",
            data: adminLink
          }
        ]
      };

      if (caption) {
        flex_text[index].bodyText = `${caption}`;
      } else {
        flex_text[index].bodyText = "📣 Chat admin group ini agar bisa diinvite ke group!";
      }

      flex_texts.push(flex_text[index]);
    }
  });

  if (!found) {
    return "💡 Tidak ada group yang tersedia. Coba nyari di '/forum'";
  }

  return flex_texts;
};

module.exports = {
  leaveGroup,
  random,
  getUpdates,
  getFlexColor,
  getSender,
  getGroupId,
  getForumInfo,
  getAbout,
  getHelp,
  getTutorial,
  cutFromArray,
  getMostFrequent,
  getRoleNameEmoji,
  getRoleTeamEmoji,
  shuffleArray,
  getPsychicResult,
  getInvestigatorResult,
  getRandomInt,
  parseToText,
  getFakeData,
  getPromotedGroup
};
