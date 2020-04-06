TODO

- buat database beneran, data user store di mongodb freakin' hard tho

- role tracker(tau target visit siapa), trapper, spy, survivor, jailor
  - tracker : dari target.index nya kita bisa tau dia visit siapa KALAU tidak di roleblock dan TIDAK di attack
    kecuali yg attack itu veteran, baru tau dia kemana
  - trapper : sama keknya mekanisme seperti bodyguard, cuman ini ribet sih
  - spy, dia bisa tau werewolf kemana aja, dan kalau dia dia bisa bug suatu target, untuk tau org itu terkena apa aja, di heal, di attack, di roleblock dll
  - survivor menang kalau dia gak mati
- kalau role udah bsa multi gitu,
  - doctor : ada private prop ke target, yg di healed, pasti harus ada prop healed by who gitu
    - doctor sementara ga bisa multi dulu, ntr lah
  - bisa ada role executioner, ini buat system baru lagi, dimana dia targetnya harus warga
    - ah nanti baru pikir kek mna bagusnya
  - bisa ada role amnesiac
  - sekarang neutral dh bisa multiple, tapi mereka ga tau siapa sesama mereka
  
- executioner, kalau berhasil bunuh yang di targetkan, dia pas endGame, di cek
  

  - if role.name executioner, check (private prop), isTargetLynched
    - berarti pas lynch func, itu check, exists gak role executioner, kalau exists
      store index of playernya, lalu (private prop) exe itu ada index targetnya, kalau
      index di private prop exe sama dengan index lynched player, maka set 
      private prop exe isTargetLynched true
  - pas endGame nya jadi kalau isTargetLynched true, yo dia menang (ini buat di logic endgame)
  
  - pas day func sama lynch func, kalau target nya executioner itu mati
    - check lagi exists atau engga role exe, kalo exists
    - get index dari role si executioner, store kan ke suatu obj
    - get targetIndexnya exe, kalau sama dengan yang udah mati (ini di death action ceknya)
    - maka exe itu di ganti rolenya ke tanner aja
    - utk flow diatas ini, bisa buat di dedicated func, biar bisa buat di call lagi

- sekarang udah bisa custom, jadi di getRandomRoleSet bnyak tugas nih

- ROLE YANG BELUM BISA DUPLICATE
  - DOKTOR
  
- ROLE YG JANGAN DUPLICATE
  - VETERAN, vampire hunter, team ww(consort, wwcub, sorcerer jangan ada dupe)
  - Arsonist, survivor
  - executioner

- buat module sendiri, untuk flex message, biar gampang dipake di bot lain
  - ini flexMessage table nya gampang di kostumisasi
  - dan buat gimana flex_textxnya itu bisa di lebih dari 1 bubble chat (max 5 bubble chat)
  - 1 carousel max 10 bubble flex
