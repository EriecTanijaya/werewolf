const getData = () => {
  const data = {
    name: "mayor",
    description:
      "Kamu adalah pemimpin warga, yang menyamar menjadi warga biasa, namun jika kamu mengungkapkan dirimu adalah Mayor, maka jumlah vote mu akan menjadi 3, tapi Doctor tidak bisa heal dirimu. \n\nUntuk mengungkapkan identitas, kamu bisa chat di group chat 'aku mayor'. Kamu tak bisa ngungkapin identitas pas malam hari",
    team: "villager",
    canKill: false,
    emoji: {
      team: "👨‍🌾",
      self: "🎩"
    },
    type: "Town Support",
    revealed: false,
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/top-hat_1f3a9.png"
  };
  return data;
};

const getInfo = () => {
  let text = "Pemimpin warga yang menyamar menjadi warga biasa. Jika Mayor mengungkapkan identitas nya, ";
  text += "Jumlah vote nya akan terhitung 3, tetapi Doctor tidak bisa heal Mayor yang telah mengungkapkan identitasnya";
  return text;
};

const botSkillAction = () => {
  return;
};

module.exports = {
  getData,
  getInfo,
  botSkillAction
};
