const getData = () => {
  const data = {
    name: "guardian-angel",
    description:
      "Kamu adalah Guardian Angel! Misimu adalah jangan sampai targetmu mati. Kamu bisa melindungi targetmu walaupun sudah mati",
    skillText: "Guardian Angel, apakah kamu ingin gunakan protectionmu?",
    cmdText: "/protect",
    team: "guardian-angel",
    canKill: false,
    emoji: {
      team: "😇",
      self: "😇"
    },
    mustProtectIndex: -1,
    protection: 2,
    type: "Neutral",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/smiling-face-with-halo_1f607.png"
  };
  return data;
};

const getInfo = () => {
  const info = {
    summary:
      "Malaikat yang bertanggung jawab untuk melindungi targetnya. Guardian Angel dapat menggunakan skill walaupun sudah mati. Jika targetnya mati, maka akan berubah menjadi Survivor tanpa vest.",
    goal: "Menjaga target agar tetap hidup"
  };
  return info;
};

module.exports = { getData, getInfo };
