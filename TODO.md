TODO
- buat list role yang ada ini, butuh itu cth :
  - ada sheriff kalau ada yang bisa di curigain
    - ada sk, ada mafia selain godfather
    - ada framer,
    - ada investigator dan executioner buat spicy
    - werewolf juga bisa spicy kan
  - ada vigilante kalau ada non villager yang bisa di dor
    - semua mafia kecuali gf
    - jester
    - vampire
    - werewolf (karna kalo ga full moon ga bisa attack)
  - ada exe kalau ada villager
  - ada arso kalo ada investigator (buat efek douse)
  - ada framer kalao ada sheriff atau dan investigator
  - ada spy kalo ada role selain mafia killing (mafia deception dan mafia support) ini lebih ke town buff nya
  - ada lookout juga kalo ada role selain mafia killing, ini lebih mild
  - vampire hunter kalo ada vampire
  - ada psychic kalo ada town dan non town
  - ada serial killer kalo ada escort atau dan consort
  
  yang ga di sebut, itu udah ga ada depensi, jadi khusus memang buat gitu gituan
  
  untuk measure point, itu ada berapa persen jumlah warga, dan berapa persen jumlah neutral dan mafia
  
  15 pemain = 9 warga, 3 mafia, 1 neutral killing, 2 neutral selain vampire (mostly) kecuali chaos mode
  
  warga 60 persen, mafia 20 persen, nk 6,6 persen, neutral 13 persen
  
  atau
  
  warga 60 persen, mafia 25 persen, nk 6,6 persen, neutral 6,6 persen
  
  hampir semua official mode formatnya sama, 60 persen warga
  
  yang beda hanya porsi non town nya itu mafia atau vampire 25 persen atau 20 persen
  
  sisa nya neutral killing 1 atau kalau porsi penjahat 20 persen, tambah 1 neutral lagi

NOTEE

- refactor role set
  - [official mode](https://town-of-salem.fandom.com/wiki/Game_Modes#:~:text=In%20the%20base%20content%20of,Dracula's%20Palace%20and%20Town%20Traitor.)
  - [unofficial mode](https://town-of-salem.fandom.com/wiki/Custom_Setups_(Classic))
  - keknya pas pemain 5 org gitu, sheriff, lalu musuh mafioso aja deh, investigator dan gf itu pas pemain udah rame
  - cara itung balance or not, itungnya kalo bisa mendekati 0 [role value](https://town-of-salem.fandom.com/wiki/Town_of_Salem_Card_Game#How_to_Play)

```
let roles = [
  {
    name: "bodyguard",
    value: 4
  },
  {
    name: "doctor",
    value: 4
  },
  {
    name: "investigator",
    value: 8
  },
  {
    name: "mayor",
    value: 8
  },
  {
    name: "sheriff",
    value: 7
  },
  {
    name: "survivor",
    value: 0
  },
  {
    name: "veteran",
    value: 4
  },
  {
    name: "vigilante",
    value: 5
  },
  {
    name: "consigliere",
    value: -10
  },
  {
    name: "godfather",
    value: -8
  },
  {
    name: "mafioso",
    value: -6
  },
  {
    name: "amnesiac",
    value: 0
  },
  {
    name: "executioner",
    value: -4
  },
  {
    name: "jester",
    value: -1
  },
  {
    name: "serial-killer",
    value: -8
  },
  {
    name: "werewolf",
    value: -9
  },
  {
    name: "consort",
    value: -8
  },
  {
    name: "vampire",
    value: -7
  },
  {
    name: "vampire-hunter",
    value: 7
  },
  {
    name: "lookout",
    value: 7
  },
  {
    name: "escort",
    value: 5
  },
  {
    name: "retributionist",
    value: 8
  },
  {
    name: "arsonist",
    value: -7
  },
  {
    name: "spy",
    value: 6
  },
  {
    name: "tracker",
    value: 7
  },
  {
    name: "framer",
    value: -6
  },
  {
    name: "disguiser",
    value: -7
  },
  {
    name: "juggernaut",
    value: -8
  },
  {
    name: "psychic",
    value: 9
  },
  {
    name: "guardian-angel",
    value: 0
  },
  {
    name: "plaguebearer",
    value: -8
  }
]

let measure = 0;
let arr = ["sheriff", "mafioso", "escort", "doctor", "executioner"];

for (let i = 0; i < roles.length; i++) {
  for (let u = 0; u < arr.length; u++) {
    if (arr[u] === roles[i].name) {
      measure += roles[i].value;
    }
  }
}

let playersLength = arr.length;
let measurePoint = measure;

console.log(`${playersLength} players with ${measurePoint} point`);
console.log(`roles : ${arr.join(", ")}`)

```

- role set trick or treat (ada di tos punya fandom wiki) buat halloween ntr

- susah ini , ada sistem buat cek visitor, cek visitor attack atau engga.

- buat database beneran, data user store di mongodb freakin' hard tho

- ROLE YG JANGAN DUPLICATE
  - plaguebearer
  - VETERAN
  - vampire hunter hanya ada saat ada vampire
  - sheriff ada kalau ada list yg bisa di suspiciouskan
  - mayor

* buat module sendiri, untuk flex message, biar gampang dipake di bot lain
  - ini flexMessage table nya gampang di kostumisasi
  - dan buat gimana flex_textxnya itu bisa di lebih dari 1 bubble chat (max 5 bubble chat)
  - 1 carousel max 10 bubble flex
