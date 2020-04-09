TODO

- RESET DATAAAA

- buat database beneran, data user store di mongodb freakin' hard tho

- role tracker(tau target visit siapa), trapper, spy, survivor, jailor
  - tracker : dari target.index nya kita bisa tau dia visit siapa KALAU tidak di roleblock dan TIDAK di attack dan tidak di intercept
    kecuali yg attack itu veteran, baru tau dia kemana
  - trapper : sama keknya mekanisme seperti bodyguard, cuman ini ribet sih
  - spy, dia bisa tau werewolf kemana aja, dan kalau dia dia bisa bug suatu target, untuk tau org itu terkena apa aja, di heal, di attack, di roleblock dll
- kalau role udah bsa multi gitu,
  - doctor : ada private prop ke target, yg di healed, pasti harus ada prop healed by who gitu
    - doctor sementara ga bisa multi dulu, ntr lah
  - bisa ada role amnesiac
  - sekarang neutral dh bisa multiple, tapi mereka ga tau siapa sesama mereka
  

- spy
  bisa tau werewolf visit
  bisa tau keadaan org yang di kuping(bugged)
  ini list ada di wiki fandom

- sekarang udah bisa custom, jadi di getRandomRoleSet bnyak tugas nih
- kalau pemain dah rame, adain **role investigator**, dimana dia miripin aj sama investigator di TOS
- buat juga sistem random role yang bisa di duplicate, barengan dengan buat istilah town protector, town killing, dll
  jadi pas di /roles, itu bisa agak catchy

- ROLE YANG BELUM BISA DUPLICATE
  - DOKTOR
  - SPY
  
- ROLE YG JANGAN DUPLICATE
  - VETERAN, vampire hunter, team ww(consort, wwcub, sorcerer jangan ada dupe)
  - Arsonist, survivor
  - executioner

- buat module sendiri, untuk flex message, biar gampang dipake di bot lain
  - ini flexMessage table nya gampang di kostumisasi
  - dan buat gimana flex_textxnya itu bisa di lebih dari 1 bubble chat (max 5 bubble chat)
  - 1 carousel max 10 bubble flex
