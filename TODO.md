TODO

- test terus changes yang ada sebelumnya
  - role baru,
  - double executioner dan double amne
  - kalau semua udah aman, refactor role set

- Role set baru
  - friday 13
  - amnesiac chaos
  

- Note push commit
  - initial psychic role (31/05/2020)
  - inital amnesiac role (31/05/2020)
  - initial guardian angel role (31/05/2020)

- role set trick or treat (ada di tos punya fandom wiki) buat halloween ntr

- susah ini , ada sistem buat cek visitor, cek visitor attack atau engga.
- role that will added if possible :
  - trapper masih belum tau gimana mechanismnya
  - ambusher, passive visit(anjir skip) ini buat visitor di attack, susah cok

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

- ROLE YG JANGAN DUPLICATE
  - VETERAN
  - vampire hunter hanya ada saat ada vampire
  - sheriff ada kalau ada list yg bisa di suspiciouskan
  - mayor

* buat module sendiri, untuk flex message, biar gampang dipake di bot lain
  - ini flexMessage table nya gampang di kostumisasi
  - dan buat gimana flex_textxnya itu bisa di lebih dari 1 bubble chat (max 5 bubble chat)
  - 1 carousel max 10 bubble flex
