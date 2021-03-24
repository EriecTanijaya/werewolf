const getData = () => {
  const data = {
    name: "vampire-hunter",
    description:
      "Kamu adalah warga yang membantu warga membasmi Vampire. Jika kamu didatangi Vampire, kamu akan membunuhnya. Kamu juga bisa mendengar percakapan Vampire saat malam. Jika semua vampire telah mati, kamu akan menjadi Vigilante",
    skillText: "Vampire Hunter, pilih siapa yang ingin di check rumahnya",
    cmdText: "/skill",
    team: "villager",
    canKill: true,
    emoji: {
      team: "👨‍🌾",
      self: "🗡️"
    },
    type: "Town Killing",
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/dagger_1f5e1.png"
  };
  return data;
};

const getInfo = () => {
  const info = {
    summary:
      "Warga yang memburu Vampire pada malam hari. Jika Vampire mengunjungi Vampire Hunter, maka Vampire Hunter akan menyerang Vampire tersebut. Jika semua Vampire di kota telah dibasmi, maka rolenya akan berubah menjadi Vigilante dengan satu peluru.",
    goal: "Menghukum semua kriminal dan penjahat"
  };
  return info;
};

module.exports = { getData, getInfo };
