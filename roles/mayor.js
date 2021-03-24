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
  const info = {
    summary:
      "Pemimpin dari kota. Jika Mayor telah mengaku rolenya, maka jumlah vote yang dikeluarkan berjumlah 3. Doctor tidak dapat heal Mayor yang telah mengungkapkan identitasnya.",
    goal: "Menghukum semua kriminal dan penjahat"
  };
  return info;
};

module.exports = { getData, getInfo };
