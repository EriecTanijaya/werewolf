const getData = () => {
  const data = {
    name: "vampire",
    description:
      "Kamu adalah makhluk yang bisa mengubah warga menjadi Vampire, misimu mengubah semua warga menjadi Vampire",
    skillText: "Vampire, pilih siapa yang ingin di ubah menjadi vampire",
    team: "vampire",
    cmdText: "/skill",
    canKill: true,
    emoji: {
      team: "🧛",
      self: "🧛"
    },
    age: 0,
    type: "Neutral Chaos",
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/vampire_1f9db.png"
  };
  return data;
};

const getInfo = () => {
  const info = {
    summary:
      "Makhluk yang dapat mengubah warga menjadi sesama Vampire. Jika jumlah Vampire mencapai 4, maka Vampire akan menyerang warga.",
    goal: "Mengubah warga menjadi Vampire dan membunuh mereka yang menentang Vampire"
  };
  return info;
};

module.exports = { getData, getInfo };
