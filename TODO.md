TODO

Update note starts from 03/06/2020
- fix jester can't use skill bug
- set proper value for afkCounter
- add new setting command : /set show_role
- misc optimization
- retributionist only can revive town member now
- fix some derp, add multicast to tell game is started
- fix bug executioner bug and guardian angel bug pas targetnya mati di hukum
- add role plaguebearer

NOTEE
- env.test jadiin false
- un comment multicast
- make random role set option

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
    value: 4
  },
  {
    name: "veteran",
    value: 3
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
    name: "pyschic",
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
      console.log(roles[i]);
      measure += roles[i].value;
    }
  }
}

console.log(measure);
```

- role set trick or treat (ada di tos punya fandom wiki) buat halloween ntr

- susah ini , ada sistem buat cek visitor, cek visitor attack atau engga.
- role that will added if possible :
  - trapper masih belum tau gimana mechanismnya
  - ambusher, passive visit(anjir skip) ini buat visitor di attack, susah cok

```
check stat

/sys/fs/cgroup/memory/memory.soft_limit_in_bytes
/sys/fs/cgroup/memory/memory.stat
/sys/fs/cgroup/cpu/cpu.cfs_quota_us
/sys/fs/cgroup/cpu/cpu.cfs_period_us
/sys/fs/cgroup/cpu/cpuacct.usage

buatkan async function sendiri pake readFile

cth memory (todo ubah ke async)
let memory = getMemoryUsage();

let string = `Here is my memory: ${memory}/512 MB (${Math.round((memory * 100)/ 512 )}%)`


function getMemoryUsage() {
  let total_rss = require('fs').readFileSync("/sys/fs/cgroup/memory/memory.stat", "utf8").split("\n").filter(l => l.startsWith("total_rss"))[0].split(" ")[1]; 
  return Math.round( Number(total_rss) / 1e6 ) - 60;
}
```

- buat database beneran, data user store di mongodb freakin' hard tho
- kalau role udah bsa multi gitu,
  - bisa ada role amnesiac
  - sekarang neutral dh bisa multiple, tapi mereka ga tau siapa sesama mereka
- sekarang udah bisa custom, jadi di getRandomRoleSet bnyak tugas nih

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
