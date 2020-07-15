const getData = () => {
  const data = {
    name: "investigator",
    description: "Kamu adalah warga yang bisa cek identitas seorang warga. ",
    skillText: "Investigator, pilih siapa yang ingin di check",
    team: "villager",
    cmdText: "/skill",
    canKill: false,
    emoji: {
      team: "👨‍🌾",
      self: "🕵️"
    },
    type: "Town Investigate",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/detective_1f575.png"
  };
  return data;
};

const getInfo = () => {
  let text = "Warga yang bisa menginvestigasi seorang warga pada malam hari. ";
  text +=
    "Jika target mu Disguiser, dan Disguiser mengimitasi orang lain, hasil cek mu adalah ";
  text += "role dari imitasi Disguiser. ";
  return text;
};

module.exports = {
  getData,
  getInfo
};
