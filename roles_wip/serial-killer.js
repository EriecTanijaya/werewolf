const getData = () => {
  const data = {
    name: "serial-killer",
    description:
      "Kamu adalah Psikopat yang hanya ingin semua orang mati. Kamu kebal dari serangan biasa, dan Menang jika semua yang menentangmu mati",
    skillText: "Serial Killer, pilih siapa yang mau kamu siksa malam ini",
    cmdText: "/skill",
    team: "serial-killer",
    canKill: true,
    emoji: {
      team: "🔪",
      self: "🔪"
    },
    type: "Neutral Killing",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/kitchen-knife_1f52a.png"
  };
  return data;
};

const getInfo = () => {
  let text =
    "Psikopat yang menang jika berhasil membunuh Team yang melawannya. ";
  text +=
    "Serial Killer kebal dari serangan biasa. Jika di role block, kamu akan bunuh yang ngerole block dan ";
  text += "mengabaikan target awalmu. ";
  
  return text;
};

module.exports = {
  getData,
  getInfo
};
