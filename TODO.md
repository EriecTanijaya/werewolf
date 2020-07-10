### TODO

- flex sistemnya ikutin yang di suit aja

- leave sama memberLeft di pindah dari other.js

- refactor all this shit function to const blabla = () => {}

- buat style folder roles/index.js -> isinya cuman require dari "./nama_role"
  - roles/namarole.js -> isinya mirip kek rolesData, tapi plus tambahan rolesInfo juga, (kalo bisa perbaiki selagi refactor)
  
- buat juga modes/index.js mirip kek roles nantik, ini nanti kita bbuat id per mode yang bisa dianuin pas /set mode
  - selain id, buat juga sekalian modeInfo disitu, sekaligus decomonize helper/index.js,
    bagi ke sini juga algoritma roles nya nantik
    
- jadi unutk src/main.js, idle.js, dan personal.js, itu nanti load langsung user_sessions dan group_sessions dari data.js
- barulah, buat this.user_session dan this.group_session dari user_sessions[this.event.source.userId] gitulah

- buat achivement kecil kecilan, ref: https://town-of-salem.fandom.com/wiki/Achievements

- hapus dulu barang di .data

- abis refactor, barulah buat sistem readFileSync di awal (ingat, pas readFile dan writeFile data dari .data, harus pake /app/.data)

- jadi user_sessions dan group_sessions bisa persistent nantinya (walaupun kita edit)

- baru eslint kan, abis tuh oke update

- role set trick or treat (ada di tos punya fandom wiki) buat halloween ntr

- susah ini , ada sistem buat cek visitor, cek visitor attack atau engga.

- buat database beneran, data user store di mongodb freakin' hard tho


### NOTEE

```
warga 60 persen, mafia 20 persen, nk 6,6 persen, neutral 13 persen	

atau	

warga 60 persen, mafia 25 persen, nk 6,6 persen, neutral 6,6 persen
```

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
