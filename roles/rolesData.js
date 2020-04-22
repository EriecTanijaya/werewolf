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
    type: "Werewolf Killing",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/wolf_1f43a.png"
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
    type: "Werewolf Support",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/mage_1f9d9.png"
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
    type: "Werewolf Support",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/no-pedestrians_1f6b7.png"
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
    type: "Town Investigate",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/crystal-ball_1f52e.png"
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
    type: "Town Protector",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/syringe_1f489.png"
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
    type: "Town",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/man-farmer_1f468-200d-1f33e.png"
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
    type: "Neutral Chaos",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/vampire_1f9db.png"
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
    type: "Town Killing",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/dagger_1f5e1.png"
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
    type: "Werewolf Killing",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/dog_1f415.png"
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
    type: "Town Killing",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/pistol_1f52b.png"
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
    type: "Neutral",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/joker_1f0cf.png"
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
    type: "Town Investigate",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/eyes_1f440.png"
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
    type: "Town Support",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/kiss-mark_1f48b.png"
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
    type: "Neutral Killing",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/kitchen-knife_1f52a.png"
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
    type: "Town Support",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/coffin_26b0.png"
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
    type: "Town Killing",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/military-medal_1f396.png"
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
    type: "Neutral Killing",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/fire_1f525.png"
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
    type: "Town Investigate",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/police-officer_1f46e.png"
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
    type: "Neutral",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/white-flag_1f3f3.png"
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
    type: "Neutral Chaos",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/axe_1fa93.png"
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
    type: "Town Investigate",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/magnifying-glass-tilted-left_1f50d.png"
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
    type: "Town Investigate",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/footprints_1f463.png"
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
    type: "Werewolf Deception",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/film-frames_1f39e.png"
  },
  {
    name: "disguiser",
    description:
      "Kamu adalah anggota Werewolf yang bisa mengimitasi nama role seorang warga, dan jika mati yang terlihat role mu adalah role yang kamu imitasi",
    skillText: "Disguiser, pilih siapa yang mau imitasi",
    cmdText: "/skill",
    team: "werewolf",
    canKill: false,
    emoji: {
      team: "🐺",
      self: "🎭"
    },
    type: "Werewolf Deception",
    disguiseAs: "",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/performing-arts_1f3ad.png"
  },
  {
    name: "bodyguard",
    description:
      "Kamu adalah warga yang bisa melindungi seseorang saat malam, dan menyerang kembali penyerang targetmu. ",
    skillText: "Bodyguard, pilih siapa yang mau kamu lindungi",
    cmdText: "/skill",
    team: "villager",
    canKill: false,
    emoji: {
      team: "👨‍🌾",
      self: "🛡️"
    },
    type: "Town Protector",
    vest: 1,
    counterAttackIndex: -1,
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/shield_1f6e1.png"
  }
];

module.exports = roles;
