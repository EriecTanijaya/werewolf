const getData = () => {
  const data = {
    name: "mafioso",
    description: "Kamu dipihak Mafia, dan kamu suruhan Godfather untuk membunuh orang lain. ",
    skillText: "Mafioso, pilih siapa yang ingin di bunuh",
    team: "mafia",
    cmdText: "/skill",
    canKill: true,
    emoji: {
      team: "🤵",
      self: "🔫"
    },
    type: "Mafia Killing",
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/pistol_1f52b.png"
  };
  return data;
};

const getInfo = () => {
  let text = "Tangan kanan Godfather dalam pembunuhan. Mafioso akan menjadi Godfather jika Godfather yang ada mati. ";
  text += "Jika Godfather tidak menggunakan skill, maka target yang dituju adalah target Mafioso. ";
  text += "Namun jika pas malam itu Mafioso di block oleh Escort, maka Mafia tidak jadi membunuh. ";
  return text;
};

const botSkillAction = (util, group_session, botIndex) => {
  const players = group_session.players;
  let targets = players
    .map((item, index) => {
      if (item.id !== players[botIndex].id && item.status === "alive" && item.role.team !== "mafia") {
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
