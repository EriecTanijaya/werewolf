TODO

Update note starts from 03/06/2020
- fix jester can't use skill bug
- set proper value for afkCounter
- add new setting command : /set show_role
- misc optimization
- add some command for city of bedburg group turnament event
- retributionist only can revive town member now
- fix some derp, add multicast to tell game is started
- fix bug executioner bug and guardian angel bug pas targetnya mati di hukum

NOTEE
- buat semua org yg ga immune udah dikasih tau dari awal kalau kena roleblock

- share secreto ntr pas update

- refactor role set
  - [official mode](https://town-of-salem.fandom.com/wiki/Game_Modes#:~:text=In%20the%20base%20content%20of,Dracula's%20Palace%20and%20Town%20Traitor.)
  - [unofficial mode](https://town-of-salem.fandom.com/wiki/Custom_Setups_(Classic))
  - keknya pas pemain 5 org gitu, sheriff, lalu musuh mafioso aja deh, investigator dan gf itu pas pemain udah rame
  - cara itung balance or not, itungnya kalo bisa mendekati 0 [role value](https://town-of-salem.fandom.com/wiki/Town_of_Salem_Card_Game#How_to_Play)
  
  add role plaguebearer neutral (unique, hanya bisa 1 di 1 game), dia bisa infect org lain. orang yang visit plaguebearer akan kenak infect juga. yang visit pemain yang terinfeksi juga ke infect
  kalau semua warga yang hidup telah terinfeksi semua, maka plaguebearer up jadi role pestilence.
  plaguebearer nanti ada dikasih tau list orang yang telah di infeksi (dari array pemain yang masih idup)
  note: kasih juga mirip kek gini untuk arsonist ya, ada listnya pake text biasa aja, jadi kirim flex_text, lalu kalau ada yang idup dan di douse, ada text list nya
  
  pestilence ini ga bisa di roleblock, ga bisa di kill oleh APAPUN, kecuali di vote
  
  efek serangan pestilence bisa di heal, namun ga bisa di bodyguard kan (RAMPAGE),
  
  kalo pestilence ke veteran, dia bakal immune, berarti pas di death action,
  cek if (roleName === pestilence), itu status nya engga jadi will_death, lalu ada pesan ke prop message nya si pestilence
  (jangan ke loop, sekali aja), kamu immune dari semua serangan!
  
  

- role set trick or treat (ada di tos punya fandom wiki) buat halloween ntr

- susah ini , ada sistem buat cek visitor, cek visitor attack atau engga.
- role that will added if possible :
  - trapper masih belum tau gimana mechanismnya
  - ambusher, passive visit(anjir skip) ini buat visitor di attack, susah cok

- jangan lupa rm rf data di .data/users, gak di pake lagi

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
  - VETERAN
  - vampire hunter hanya ada saat ada vampire
  - sheriff ada kalau ada list yg bisa di suspiciouskan
  - mayor

* buat module sendiri, untuk flex message, biar gampang dipake di bot lain
  - ini flexMessage table nya gampang di kostumisasi
  - dan buat gimana flex_textxnya itu bisa di lebih dari 1 bubble chat (max 5 bubble chat)
  - 1 carousel max 10 bubble flex
