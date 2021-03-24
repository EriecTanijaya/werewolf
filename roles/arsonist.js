const getData = () => {
  const data = {
    name: "arsonist",
    description:
      "Kamu adalah orang gila yang ingin semua orang mati dibakar. Untuk membakar rumah target, gunakan skill ke diri sendiri. Pastikan sudah menyiram bensin ke rumah target-target. Setiap orang yang mengunjungimu akan tersiram bensin juga.",
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
  const info = {
    summary: "Si maniak api yang kebal dengan serangan biasa saat malam, dan hanya ingin semua orang terbakar.",
    goal: "Membakar semua warga desa"
  };
  return info;
};

module.exports = { getData, getInfo };
