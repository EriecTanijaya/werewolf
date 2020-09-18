const getData = () => {
  const data = {
    name: "doctor",
    description:
      "Kamu adalah warga yang bisa menyembuhkan suatu orang pada malam hari, mana tau orang lain butuh bantuan.",
    skillText: "Doctor, pilih siapa yang ingin dilindungi",
    team: "villager",
    cmdText: "/skill",
    canKill: false,
    emoji: {
      team: "👨‍🌾",
      self: "💉"
    },
    selfHeal: 1,
    type: "Town Protector",
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/syringe_1f489.png"
  };
  return data;
};

const getInfo = () => {
  let text =
    "Warga yang bisa memilih siapa yang ingin dilindungi. Dapat melindungi dari serangan biasa atau gigitan Vampire. ";
  text += "Kamu bisa tahu target mu diserang atau tidak. Skill Heal Doctor tidak bisa menolong ";
  text += "Vigilante yang akan mati karena bunuh diri, pembakaran Arsonist dan penyerangan Jester. ";
  text += "Doctor hanya bisa menyembuhkan diri sendiri 1 kali saja. ";
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

  const what = util.random(["self", "other"]);

  if (players[botIndex].role.selfHeal > 0 && what === "self") {
    group_session.players[botIndex].target.index = botIndex;
  } else {
    group_session.players[botIndex].target.index = targets[0];
  }
};

module.exports = {
  getData,
  getInfo,
  botSkillAction
};
