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
