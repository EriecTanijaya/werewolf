const util = require("../util");

const enoughPlayer = () => {
  const arr = [
    "📣 Sudah cukup pemain, game bisa dimulai",
    "📣 Oke, pemainnya udah cukup, udah bisa dimulai gamenya",
    "📣 Yok yok nambah pemain lagii",
    "📣 Yakin segini aja cukup?",
    "📣 Game udah bisa di mulai, tapi masih bisa nambah pemain!"
  ];
  return util.random(arr);
};

const stopGame = who => {
  const arr = [`💡 Jiahh, game di stop ${who}`, `💡 Game telah di stop ${who}`, `💡 Bubar bubar!`];
  return util.random(arr);
};

const punish = (punishment, lynchedName, voteCount) => {
  const arr = [
    `💀 Warga memutuskan untuk ${punishment} ${lynchedName} dengan jumlah ${voteCount} vote`,
    `💀 ${lynchedName} akan di${punishment} sesuai dengan hasil musyawarah`,
    `💀 Dengan ${voteCount} jumlah vote, ${lynchedName} akan di${punishment} sesuai adat yang berlaku`,
    `💀 "BIAR AKU YANG ${punishment.toUpperCase()} DIRI SENDIRI AJA!" ujar ${lynchedName}. Semua orang pun terdiam`,
    `💀 Disaat para warga masih sibuk berdebat, ${lynchedName} ${punishment} diri sendiri`,
    `💀 Selamat, ${lynchedName} berhasil di${punishment} dengan jumlah ${voteCount} vote!`,
    `💀 Warga merasa kasihan dengan ${lynchedName}, tetapi tetap ae mereka ${punishment} dia`,
    `💀 "Avada Kedavra!" ${lynchedName} menghilang tanpa ada jejak. \n\n🧙 Hairy Potter : "err, aku bisa jelaskan"`
  ];
  return util.random(arr);
};

const join = name => {
  const arr = [
    `💡 ${name} berhasil bergabung!`,
    `💡 Jeng jeng! ${name} bergabung dalam game!`,
    `💡 ${name} diam diam join ke game dengan calo`,
    `💡 Mantab, ${name} berhasil join game!`,
    `💡 Eits eits, ${name} bergabung ke dalam game nih!`,
    `💡 Wah, ${name} join ke dalam game. Bubarrrrrr`,
    `💡 Akhirnya, ${name} join ke dalam game`,
    `💡 ${name} menyalip diantara kerumunan dan join kedalam game`
  ];
  return util.random(arr);
};

const memberJoined = (name, groupName) => {
  const arr = [
    `👋 Selamat datang ${name} di ${groupName}!`,
    `😲 Is it bird? Is it plane? NO! It's just ${name}!`,
    `⚠️ PERHATIAN! ${name} memasuki daerah ${groupName}!`,
    `🏃 ${name} datang, pesta bubarrr`,
    `🤲 Akhirnya ${name} datang, sesuai dengan ramalan`,
    `🏡 ${groupName} bertambah populasi dengan datangnya ${name}`,
    `🥁 Ba dum tsss. ${name} bergabung ke sini`,
    `💡 A wild ${name} appeared`,
    `🛩️ Swoooosh. ${name} just landed`
  ];
  return util.random(arr);
};

const checkNight = time => {
  const arr = [
    `⏳ Sisa waktu ${time} detik lagi untuk menyambut mentari ☀️`,
    `👨‍🌾 : matahawi matahawi, kapan kamu terbit?\n☀️ : ${time} detik lagi bos`,
    `☀️ : *terbangun dari tidur*\n☀️ : *liat jam* ah masih sisa ${time} detik lagi\n☀️ : *tidur lagi*`,
    `⏳ Dalam ${time} detik lagi, matahawi terbit`,
    `☀️ : aku otw dalam ${time} detik lagi, siap siap\n🐔 : kok?`,
    `⏳ ${time} detik lagi matahari terbit ☀️`,
    `⏳ Waktu tersisa ${time} detik lagi`
  ];
  return util.random(arr);
};

const kicked = () => {
  const arr = [
    "👋 Selamat tinggal!",
    "👋 Byee!",
    "👋 Bubay! Kalo kangen invite aja lagi",
    "💡 City Of Bedburg was here",
    "✈️ Mari pulang marilah pulang",
    "👋 it's been a fun ride. Thanks",
    "👋 Hasta la vista, baby"
  ];
  return util.random(arr);
};

const alreadyDead = (name, causeOfDeath) => {
  return `💡 ${name}, kamu sudah mati. Penyebabnya adalah ${causeOfDeath}`;
};

module.exports = {
  enoughPlayer,
  stopGame,
  punish,
  join,
  memberJoined,
  checkNight,
  kicked,
  alreadyDead
};
