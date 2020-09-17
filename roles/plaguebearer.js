const getData = () => {
  const data = {
    name: "plaguebearer",
    description: "Kamu adalah dokter korup yang ingin semua orang terinfeksi",
    skillText: "Plaguebearer, pilih siapa yang mau kamu infeksi",
    cmdText: "/skill",
    team: "plaguebearer",
    canKill: false,
    emoji: {
      team: "☣️",
      self: "☣️"
    },
    isPestilence: false,
    type: "Neutral Killing",
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/biohazard_2623.png"
  };
  return data;
};

const getInfo = () => {
  let text = "Dokter korup yang kesal dengan Mayor, yang memutuskan untuk menginfeksi semua orang dan ";
  text += "membunuh mereka dengan penyakit sampar. ";
  text += "Infeksi bisa ditularkan dan yang terinfeksi tidak akan tau jika dia terinfeksi. ";
  text += "Jika Plaguebearer berhasil menginfeksi seluruh penghuni kota, maka dia bisa rampage di rumah orang";
  return text;
};

const botSkillAction = (util, group_session, botIndex) => {
  const players = group_session.players;
  const isPestilence = players[botIndex].role.isPestilence;

  if (isPestilence) {
    let targets = players
      .map((item, index) => {
        if (item.status === "alive") {
          return index;
        }
      })
      .filter(item => {
        return item !== undefined;
      });

    targets = util.shuffleArray(targets);

    group_session.players[botIndex].target.index = targets[0];
    return;
  }

  let targets = group_session.players
    .map((item, index) => {
      if (item.id !== players[botIndex].id && item.status === "alive") {
        return {
          index,
          infected: item.infected
        };
      }
    })
    .filter(item => {
      return item !== undefined;
    });

  targets = util.shuffleArray(targets);

  for (let i = 0; i < targets.length; i++) {
    if (!targets[i].infected) {
      group_session.players[botIndex].target.index = targets[i].index;
      return;
    }
  }

  group_session.players[botIndex].target.index = botIndex;
};

module.exports = {
  getData,
  getInfo,
  botSkillAction
};
