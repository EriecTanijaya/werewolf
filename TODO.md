TODO
- untuk exe bisa multi sbebenarnya, target bisa sama, dan pas lynch func
  ganti logicnya. buat aja loop disana,
  - loop 1 cari exe
  - loop 2 cek target lynch index exe yg dari loop 1 itu sama atau engga, kalau sama, found
  - kalau found, baru jalanin logic
- susah ini , ada sistem buat cek visitor, cek visitor attack atau engga.
- role that will added if possible :
  - psychic, pada non full moon, bisa ada 3 nama, salah satu ada yang jahat, pada full moon ada 2 nama, salah satu ada yang baik
    - baik hanya town, survivor, amnesiac, guardian angel, sisa jahat
    - kalau di block ga bisa dapat info
    - ga ada skill malam
    - cek trivia di psyhic, kalau udah ga ada yang baik apa resultnya
  - trapper masih belum tau gimana mechanismnya
  - ambusher, passive visit(anjir skip)
  - amnesiac ribet
  - guardiana angle ribet
- additional info, investigator kasih tau rolenya ga langsung, tapi pake guess
- executioner bisa ada target yang sama, tapi skrng belum support lebih dari 1 exe, kalau ada sistem lebih modular, bisa ada role amnesiac

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
