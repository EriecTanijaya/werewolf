const getData = () => {
  const data = {
    name: "villager",
    description:
      "Kamu adalah warga (luar)biasa, tugasmu itu menggantung penjahat. Dan tolong, jangan micin",
    team: "villager",
    canKill: false,
    emoji: {
      team: "👨‍🌾",
      self: "👨‍🌾"
    },
    type: "Town",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/man-farmer_1f468-200d-1f33e.png"
  };
  return data;
};

const getInfo = () => {
  let text = "Villager atau Townie, adalah kelompok warga yang memiliki misi ";
  text += "untuk menghukum orang yang membawa malapetaka di Kota Bedburg. ";
  text +=
    "Jika ada lebih dari 1 Villager di kota, maka nanti akan diberi suatu kode ";
  text += "agar Villager bisa mengetahui sesamanya";
  return text;
};

module.exports = {
  getData,
  getInfo
};
