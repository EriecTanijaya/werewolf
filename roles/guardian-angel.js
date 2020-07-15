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
  let text =
    "Orang yang misinya adalah untuk melindungi Targetnya. Guardian Angel dapat melindungi Targetnya walaupun sudah mati. ";
  text +=
    "Jika targetnya mati, maka Guardian Angel akan berubah menjadi Survivor tanpa vest. ";
  text +=
    "Protection dari Guardian Angel dapat melindungi nya dari serangan apapun dan ";
  text += "bisa menghilangkan efek siraman bensin Arsonist. ";
  text +=
    "Saat Guardian Angel berhasil melidungi Targetnya, besoknya Target tersebut tidak bisa di vote. ";
  return text;
};

module.exports = {
  getData,
  getInfo
};
