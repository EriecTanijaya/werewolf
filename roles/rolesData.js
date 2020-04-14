const roles = [
  {
    name: "werewolf",
    description:
      "Kamu adalah penjahat yang menyamar diantara werewolf. Kamu kebal dari serangan biasa. ",
    skillText: "Werewolf, Pilih siapa mangsamu",
    cmdText: "/skill",
    team: "werewolf",
    canKill: true,
    emoji: {
      team: "🐺",
      self: "🐺"
    },
    type: "Werewolf Killing"
  },
  {
    name: "sorcerer",
    description:
      "Kamu adalah penjahat yang bisa mengetahui suatu role. Kamu di pihak Werewolf",
    skillText: "Sorcerer, Pilih siapa yang ingin diterawang",
    cmdText: "/skill",
    team: "werewolf",
    canKill: false,
    emoji: {
      team: "🐺",
      self: "🧙"
    },
    type: "Werewolf Support"
  },
  {
    name: "consort",
    description:
      "Kamu adalah penjahat yang bisa block skill suatu pemain saat malam. Kamu di pihak Werewolf",
    skillText: "Consort, Pilih siapa yang ingin di block",
    cmdText: "/skill",
    team: "werewolf",
    canKill: false,
    emoji: {
      team: "🐺",
      self: "🚷"
    },
    type: "Werewolf Support"
  },
  {
    name: "seer",
    description:
      "Kamu adalah warga yang bisa cek identitas sebenarnya dari suatu orang. Gantung Werewolf supaya kamu menang",
    skillText: "Seer, pilih siapa yang ingin di check",
    team: "villager",
    cmdText: "/skill",
    canKill: false,
    emoji: {
      team: "👨‍🌾",
      self: "🔮"
    },
    type: "Town Investigate"
  },
  {
    name: "doctor",
    description:
      "Kamu adalah warga yang bisa menyembuhkan suatu orang pada malam hari, mana tau orang lain butuh bantuan.",
    skillText: "Doctor, pilih siapa yang ingin dilindungi",
    team: "villager",
    cmdText: "/skill",
    canKill: false,
    emoji: {
      team: "👨‍🌾",
      self: "💉"
    },
    selfHeal: 1,
    type: "Town Protector"
  },
  {
    name: "villager",
    description:
      "Kamu adalah warga (luar)biasa, tugasmu itu cari tau siapa werewolf, dan gantungkan werewolfnya",
    team: "villager",
    canKill: false,
    emoji: {
      team: "👨‍🌾",
      self: "👨‍🌾"
    },
    type: "Town"
  },
  {
    name: "vampire",
    description:
      "Kamu bukan dipihak warga atau werewolf, misi kamu gantung werewolf dan membuat semua warga menjadi vampire.",
    skillText: "Vampire, pilih siapa yang ingin di ubah menjadi vampire",
    team: "vampire",
    cmdText: "/skill",
    canKill: true,
    emoji: {
      team: "🧛",
      self: "🧛"
    },
    age: 0,
    type: "Neutral Chaos"
  },
  {
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
    type: "Town Killing"
  },
  {
    name: "werewolf-cub",
    description:
      "Kamu dipihak werewolf, dan kamu suruhan Werewolf untuk membunuh orang lain. ",
    skillText: "Werewolf Cub, pilih siapa yang ingin di bunuh",
    team: "werewolf",
    cmdText: "/skill",
    canKill: true,
    emoji: {
      team: "🐺",
      self: "🐕"
    },
    type: "Werewolf Killing"
  },
  {
    name: "vigilante",
    description:
      "Kamu adalah warga yang bisa memilih siapa yang ingin dibunuh pas malam. Jika kamu bunuh sesama warga, kamu akan bunuh diri keesokan harinya",
    skillText: "Vigilante, pilih siapa yang ingin dibunuh",
    cmdText: "/skill",
    team: "villager",
    canKill: true,
    emoji: {
      team: "👨‍🌾",
      self: "🔫"
    },
    isLoadBullet: true,
    bullet: 3,
    type: "Town Killing"
  },
  {
    name: "jester",
    description:
      "Kamu menang jika berhasil digantung. Dan bisa bunuh siapa saja disaat sudah mati",
    team: "jester",
    skillText: "Jester, pilih siapa yang ingin dihantui",
    cmdText: "/skill",
    canKill: false,
    emoji: {
      team: "🃏",
      self: "🃏"
    },
    isLynched: false,
    hasRevenged: false,
    type: "Neutral"
  },
  {
    name: "lookout",
    description:
      "Kamu adalah warga yang bisa memantau rumah seseorang pas malam, sehingga bisa mengetahui siapa pendatangnya",
    skillText: "Lookout, pilih rumah yang ingin dipantau",
    cmdText: "/skill",
    team: "villager",
    canKill: false,
    emoji: {
      team: "👨‍🌾",
      self: "👀"
    },
    type: "Town Investigate"
  },
  {
    name: "escort",
    description:
      "Kamu adalah warga yang bisa block skill pemain lain, sehingga targetmu tidak dapat menggunakan skill malamnya. Hati hati, kamu bisa block skill sesama warga",
    skillText: "Escort, pilih siapa yang mau kamu distrak malam ini",
    cmdText: "/skill",
    team: "villager",
    canKill: false,
    emoji: {
      team: "👨‍🌾",
      self: "💋"
    },
    type: "Town Support"
  },
  {
    name: "serial-killer",
    description:
      "Kamu adalah Psikopat yang hanya ingin semua orang mati. Kamu kebal dari serangan biasa, dan Menang jika semua yang menentangmu mati",
    skillText: "Serial Killer, pilih siapa yang mau kamu siksa malam ini",
    cmdText: "/skill",
    team: "serial-killer",
    canKill: true,
    emoji: {
      team: "🔪",
      self: "🔪"
    },
    type: "Neutral Killing"
  },
  {
    name: "retributionist",
    description:
      "Kamu adalah warga yang bisa membangkitkan orang yang telah mati. ",
    skillText: "Retributionist, pilih siapa yang mau kamu bangkitkan",
    cmdText: "/skill",
    team: "villager",
    canKill: false,
    emoji: {
      team: "👨‍🌾",
      self: "⚰️"
    },
    revive: 1,
    type: "Town Support"
  },
  {
    name: "veteran",
    description:
      "Kamu adalah warga yang memiliki paranoia, jika kamu 'alert', maka kamu akan membunuh siapa saja yang kerumahmu. ",
    skillText: "Veteran, apakah kamu akan alert malam ini?",
    cmdText: "/alert",
    team: "villager",
    canKill: true,
    emoji: {
      team: "👨‍🌾",
      self: "🎖️"
    },
    alert: 3,
    type: "Town Killing"
  },
  {
    name: "arsonist",
    description:
      "Kamu adalah orang gila yang ingin semua orang mati dibakar. Untuk membakar rumah target, gunakan skill ke diri sendiri. Pastikan sudah menyiram bensin ke rumah target-target",
    skillText:
      "Arsonist, pilih rumah siapa yang ingin kamu sirami dengan bensin.",
    cmdText: "/skill",
    team: "arsonist",
    canKill: true,
    emoji: {
      team: "🔥",
      self: "🔥"
    },
    type: "Neutral Killing"
  },
  {
    name: "sheriff",
    description:
      "Kamu adalah warga yang bisa cek suatu warga mencurigakan atau tidak. ",
    skillText: "Sheriff, pilih siapa yang mau kamu cek",
    cmdText: "/skill",
    team: "villager",
    canKill: false,
    emoji: {
      team: "👨‍🌾",
      self: "👮"
    },
    type: "Town Investigate"
  },
  {
    name: "survivor",
    description:
      "Kamu bisa berpihak dengan siapa saja, asalkan kamu tidak mati. Jika kamu hidup hingga akhir game, kamu menang",
    skillText: "Survivor, apakah kamu akan gunakan vest malam ini?",
    cmdText: "/vest",
    team: "survivor",
    canKill: false,
    emoji: {
      team: "🏳️",
      self: "🏳️"
    },
    vest: 4,
    type: "Neutral"
  },
  {
    name: "executioner",
    description:
      "Kamu adalah pendendam mengerikan dan kamu menang jika targetmu itu mati digantung oleh warga",
    team: "executioner",
    canKill: false,
    emoji: {
      team: "🪓",
      self: "🪓"
    },
    type: "Neutral Chaos"
  },
  {
    name: "spy",
    description:
      "Kamu adalah warga yang bisa mengetahui siapa saja yang dikunjungi Werewolf saat malam dan menyadap suatu orang",
    skillText: "Spy, pilih siapa yang mau kamu sadap",
    cmdText: "/skill",
    team: "villager",
    canKill: false,
    emoji: {
      team: "👨‍🌾",
      self: "🔍"
    },
    type: "Town Investigate"
  },
  {
    name: "tracker",
    description:
      "Kamu adalah warga yang bisa melacak Targetmu kemana saja saat malam. ",
    skillText: "Tracker, pilih siapa yang mau kamu lacak",
    cmdText: "/skill",
    team: "villager",
    canKill: false,
    emoji: {
      team: "👨‍🌾",
      self: "👣"
    },
    type: "Town Investigate"
  },
  {
    name: "framer",
    description:
      "Kamu adalah anggota Werewolf yang bisa menjebak seorang warga pada malam hari agar warga tersebut terlihat bersalah jika di cek",
    skillText: "Framer, pilih siapa yang mau dijebak",
    cmdText: "/skill",
    team: "werewolf",
    canKill: false,
    emoji: {
      team: "🐺",
      self: "🎞️"
    },
    type: "Werewolf Support"
  },
];

module.exports = roles;
