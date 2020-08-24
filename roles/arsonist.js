const getData = () => {
  const data = {
    name: "arsonist",
    description:
      "Kamu adalah orang gila yang ingin semua orang mati dibakar. Untuk membakar rumah target, gunakan skill ke diri sendiri. Pastikan sudah menyiram bensin ke rumah target-target",
    skillText: "Arsonist, pilih rumah siapa yang ingin kamu sirami dengan bensin.",
    cmdText: "/skill",
    team: "arsonist",
    canKill: true,
    emoji: {
      team: "🔥",
      self: "🔥"
    },
    type: "Neutral Killing",
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/fire_1f525.png"
  };
  return data;
};

const getInfo = () => {
  let text = "Maniak api yang hanya ingin semua orang terbakar. ";
  text +=
    "Arsonist kebal dari serangan biasa saat malam. Pilih diri sendiri jika ingin membakar rumah target yang telah di sirami bensin. Jika ada yang mengunjungi Arsonist, dia akan tersiram bensin juga.";
  return text;
};

module.exports = {
  getData,
  getInfo
};
