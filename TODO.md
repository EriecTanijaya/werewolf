TODO

- buat deskripsi role set
- masukin bg ke role set di helper func

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

- buat sistem settings, setting waktu di game, setting mode game (buat custom role set)
- buat database beneran, data user store di mongodb freakin' hard tho
- kalau role udah bsa multi gitu,
  - doctor : ada private prop ke target, yg di healed, pasti harus ada prop healed by who gitu
    - doctor sementara ga bisa multi dulu, ntr lah
  - bisa ada role amnesiac
  - sekarang neutral dh bisa multiple, tapi mereka ga tau siapa sesama mereka
- sekarang udah bisa custom, jadi di getRandomRoleSet bnyak tugas nih
- kalau pemain dah rame, adain **role investigator**, dimana dia miripin aj sama investigator di TOS

- ROLE YANG BELUM BISA DUPLICATE
  - DOKTOR
  - SPY, store data spyBuggedInfo dalam obj,
    
    ubah spyBuggedInfo ke {}
  
    jadi ada obj -> spyBuggedInfo[spyTargetIndex] = "isi"
    
    spy action
    message += spyBuggedInfo[targetIndex];
  
- ROLE YG JANGAN DUPLICATE
  - VETERAN, vampire hunter, team ww(consort, wwcub, sorcerer jangan ada dupe)
  - Arsonist, survivor
  - executioner

- buat module sendiri, untuk flex message, biar gampang dipake di bot lain
  - ini flexMessage table nya gampang di kostumisasi
  - dan buat gimana flex_textxnya itu bisa di lebih dari 1 bubble chat (max 5 bubble chat)
  - 1 carousel max 10 bubble flex
