const getUpdates = () => {
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
      headerText: "🎉 Versi " + item.version,
      bodyText: item.majorChanges,
      buttons: [
        {
          action: "uri",
          label: "👆 check",
          data: item.link
        }
      ]
    };
    flex_texts.push(flex_text[index]);
  });

  return flex_texts;
};

const getAbout = () => {
  let text = "Bot semi automatic yang terinspirasi dari ";
  text += "Town Of Salem. ";
  text +=
    "Thanks buat grup Avalon City, LOW, Where Wolf(?), Random, RND Twins dan semua adders!" +
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
      body +=
        "Jangan lupa pc bot '/news' untuk mengetahui berita hasil skill. ";
      body += "Diskusilah siapa yang akan di vote. ";
      body += "Ketik '/help' lagi untuk bantuan.";
      break;

    case "night":
      header += "🌙 Gunakan skill";
      body += "Gunakan skill dengan klik button 'role' di flex bot atau ";
      body += "pc bot dengan perintah '/role'. ";
      body +=
        "Jika bingung info peran, bisa gunakan perintah '/info <nama-role>'. " +
        "\n";
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
      body +=
        "Jika yang dihukum adalah warga, perhatikan siapa yang vote siapa, dan biasanya dari hasil vote itu ";
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

const leaveGroup = (groupId, text) => {
  return this.client
    .replyMessage(this.event.replyToken, {
      type: "text",
      text: text
    })
    .then(() => {
      if (this.event.source.type === "group") {
        this.client.leaveGroup(groupId);
      } else {
        this.client.leaveRoom(groupId);
      }
    });
};

const random = array => {
  return array[Math.floor(Math.random() * array.length)];
};

const getFlexColor = () => {
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
};

module.exports = {
  leaveGroup,
  random,
  getUpdates,
  getFlexColor
};
