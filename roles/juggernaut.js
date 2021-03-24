const getData = () => {
  const data = {
    name: "juggernaut",
    description: "Kamu adalah kriminal yang akan semakin kuat jika membunuh orang",
    skillText: "Juggernaut, pilih siapa yang mau kamu bunuh",
    cmdText: "/skill",
    team: "juggernaut",
    canKill: true,
    emoji: {
      team: "💪",
      self: "💪"
    },
    type: "Neutral Killing",
    skillLevel: 0,
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/flexed-biceps_1f4aa.png"
  };
  return data;
};

const getInfo = () => {
  const info = {
    summary: `Seorang kriminal yang kekuatannya semakin bertambah setiap kali ia berhasil membunuh. Awalnya Juggernaut hanya bisa menggunakan skillnya pada bulan purnama.\n\n🥊 Jika berhasil membunuh sekali, ia dapat menggunakan skill setiap malam\n🥊 2 kali membunuh, ia dapat kebal dari serangan biasa\n🥊 3 kali membunuh, ia dapat membunuh target beserta tamu dari target tersebut\n🥊 4 kali membunuh, serangannya dapat menembus pertahanan biasa`,
    goal: "Membunuh semua orang yang menentangmu"
  };
  return info;
};

module.exports = { getData, getInfo };
