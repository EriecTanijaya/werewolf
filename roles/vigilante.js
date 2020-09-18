const getData = () => {
  const data = {
    name: "vigilante",
    description:
      "Kamu adalah warga yang bisa memilih siapa yang ingin dibunuh pas malam. Jika kamu bunuh sesama warga, kamu akan bunuh diri keesokan harinya",
    skillText: "Vigilante, pilih siapa yang ingin dibunuh",
    cmdText: "/skill",
    team: "villager",
    canKill: true,
    emoji: {
      team: "👨‍🌾",
      self: "🔫"
    },
    isLoadBullet: true,
    bullet: 3,
    type: "Town Killing",
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/pistol_1f52b.png"
  };
  return data;
};

const getInfo = () => {
  let text = "Warga yang bisa menyerang orang lain saat malam. ";
  text += "Tetapi jika dia membunuh sesama warga, dia akan bunuh diri keesokan harinya. ";
  text += "Vigilante harus menunggu satu malam untuk menyiapkan senjatanya dan baru bisa menggunakan skill ";
  text += "keesokkan harinya. ";
  return text;
};

const botSkillAction = (util, group_session, botIndex) => {
  const isLoadBullet = group_session.players[botIndex].role.isLoadBullet;
  if (isLoadBullet) return;

  const bullet = group_session.players[botIndex].role.bullet;
  if (bullet === 0) return;

  if (group_session.players[botIndex].willSuicide) return;

  const players = group_session.players;
  let targets = players
    .map((item, index) => {
      if (item.id !== players[botIndex].id && item.status === "alive") {
        return index;
      }
    })
    .filter(item => {
      return item !== undefined;
    });

  targets = util.shuffleArray(targets);

  group_session.players[botIndex].target.index = targets[0];
};

module.exports = {
  getData,
  getInfo,
  botSkillAction
};
