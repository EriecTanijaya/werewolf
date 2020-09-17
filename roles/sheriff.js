const getData = () => {
  const data = {
    name: "sheriff",
    description: "Kamu adalah warga yang bisa cek suatu warga mencurigakan atau tidak. ",
    skillText: "Sheriff, pilih siapa yang mau kamu cek",
    cmdText: "/skill",
    team: "villager",
    canKill: false,
    emoji: {
      team: "👨‍🌾",
      self: "👮"
    },
    type: "Town Investigate",
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/police-officer_1f46e.png"
  };
  return data;
};

const getInfo = () => {
  let text = "Warga yang bisa cek suatu pemain mencurigakan atau tidak. ";
  text += "Yang tampil mencurigakan adalah semua anggota Mafia kecuali Godfather, Serial Killer, ";
  text += "orang yang di frame oleh Framer, dan Werewolf pada saat malam genap (bulan purnama)";
  return text;
};

const botSkillAction = (util, group_session, botIndex) => {
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
