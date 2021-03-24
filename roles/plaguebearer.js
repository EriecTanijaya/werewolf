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
  const info = {
    summary:
      "Dokter korup yang menyebarkan penyakit. Warga yang terinfeksi dapat menular kepada orang lain melalui skill yang digunakan saat malam hari.",
    goal: "Menyebarkan penyakit ke semua warga, kemudian membunuh mereka dengan penyakit sampar"
  };
  return info;
};

module.exports = { getData, getInfo };
