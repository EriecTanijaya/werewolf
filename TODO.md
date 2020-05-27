TODO
- full moon itu malam yang genap
- susah ini , ada sistem buat cek visitor, cek visitor attack atau engga.
- rebrand, role werewolf sekarang jadi mafia, alpha werewolf = godfather, ww cub = mafioso, seer = investigator
- role that will added if possible :
  - werewolf (yes, with full moon and rampage shit)
  - juggernaut with more power each kill
  - psychic, pada non full moon, bisa ada 3 nama, salah satu ada yang jahat, pada full moon ada 2 nama, salah satu ada yang baik
    - baik hanya town, survivor, amnesiac, guardian angel, sisa jahat
    - kalau di block ga bisa dapat info
    - ga ada skill malam
  - trapper masih belum tau gimana mechanismnya
  - ambusher, passive visit(anjir skip)
  - amnesiac ribet
  - guardiana angle ribet
  - werewolf, pas full moon bisa rampage di rumah orang, di cek sheriff bisa mencurigakan. kalau rumah nya jadi target rampage, itu siapa aja yang kesana mati
    - kalau ww ke rmh veteran, ww mati, tapi vete mati juga (kalau ada yang ke vete, mati juga sama ww dan vete) asli ribet
  - jugg mirip sama ww, tapi ada kek level up skill gitu
- additional info, investigator kasih tau rolenya ga langsung, tapi pake guess
- executioner bisa ada target yang sama, tapi skrng belum support lebih dari 1 exe, kalau ada sistem lebih modular, bisa ada role amnesiac
- 


- kau ngapain rik? reverse engineering town of salem WKWWK

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

* buat module sendiri, untuk flex message, biar gampang dipake di bot lain
  - ini flexMessage table nya gampang di kostumisasi
  - dan buat gimana flex_textxnya itu bisa di lebih dari 1 bubble chat (max 5 bubble chat)
  - 1 carousel max 10 bubble flex
