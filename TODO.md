TODO

- Note push commit
  - initial psychic role (31/05/2020)

- susah ini , ada sistem buat cek visitor, cek visitor attack atau engga.
- role that will added if possible :
  - trapper masih belum tau gimana mechanismnya
  - ambusher, passive visit(anjir skip) ini buat visitor di attack, susah cok
  - amnesiac
    - hanya bisa pake skill kek retri(sama orang mati)
    - di announce ke publik : Amnesiac baru teringat bahwa dia adalah seorang 'nama role'
  - guardiana angle ribet

- executioner bisa ada target yang sama, tapi skrng belum support lebih dari 1 exe, kalau ada sistem lebih modular, bisa ada role amnesiac

- bisa ada lebih dari 1 executioner punya role set! (kalau udah support)

- jangan lupa rm rf data di .data/users, gak di pake lagi

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
