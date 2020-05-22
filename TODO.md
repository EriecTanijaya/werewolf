TODO

- add role janitor
jadi kalau ada janitor, itu prop target janitor ada cleaned, dan kalau mati dan cleaned true, itu nanti rolenya ga dikasih tau
kalau cleaned dan ga mati, itu cleaned = false
janitor ada 3 cleanings. jadi werewolf cub kalau ga ada Werewolf Killings, janitor diatas escort (top prio)

checker buat semua player = if (status == death && cleaned === true) berarti 'CLEANED' di playersCommand, 
tapi untuk werewolfAnnouncement, dikasih tau role nya
janitor werewolf deception
RETRI gak bisa revive yang cleaned === true (penting)

abis uda buat, masukin role itu ke role set sesuai type masing masing

- buat wiki keci-kecilan buat role role dan mode

- properly mekanis attacked bisa pake skill itu gmna

```
let playersLength = 5
let townNeedCount = Math.round(playersLength / 2) + 1;
let badNeedCount = playersLength - townNeedCount;
let werewolfNeedCount = Math.round((50 / 100) * badNeedCount);
//werewolfNeedCount = 4;
let neutralNeedCount = badNeedCount - werewolfNeedCount;

console.log(`jumlah pemain ${playersLength}`)
console.log(`town ${townNeedCount}, ww ${werewolfNeedCount}, neutral ${neutralNeedCount}`)
```

- buat database beneran, data user store di mongodb freakin' hard tho
- kalau role udah bsa multi gitu,
  - bisa ada role amnesiac
  - sekarang neutral dh bisa multiple, tapi mereka ga tau siapa sesama mereka
- sekarang udah bisa custom, jadi di getRandomRoleSet bnyak tugas nih
- kalau pemain dah rame, adain **role investigator**, dimana dia miripin aj sama investigator di TOS

- ROLE YANG BELUM BISA DUPLICATE
  - executioner
  - veteran, sebenarnya bisa ganti veteranIndexes jadiin kek spyBuggedInfo, tapi kalo banyak veteran ga bagus
  
- ROLE YG JANGAN DUPLICATE
  - VETERAN
  - executioner
  - team ww semua
  - vampire hunter hanya ada saat ada vampire
  - sheriff ada kalau ada list yg bisa di suspiciouskan
  - vigilante ada kalau ada musuh yang bisa di dor
  

- buat module sendiri, untuk flex message, biar gampang dipake di bot lain
  - ini flexMessage table nya gampang di kostumisasi
  - dan buat gimana flex_textxnya itu bisa di lebih dari 1 bubble chat (max 5 bubble chat)
  - 1 carousel max 10 bubble flex
