module.exports = {
  receive: function(client, event, args) {
    this.client = client;
    this.event = event;
    this.args = args;

    let flex_text = {
      header: {
        text: ""
      },
      body: {
        text: ""
      }
    };

    /// TODO buat command juga buat /info utk kasih tau /info type, /info team
    // "untuk info type = list ada type apa saja di game", /info <nama-type> buat langsung jelasin type apa, dan siapa aja
    // /info team = ada team apa aja di game, /info <nama-team> buat kasih tau siapa aja yang ada di list (ini bentrok sama /info villager)

    if (!this.args[1]) {
      let roles = require("/app/roles/rolesData").map(role => {
        return role.name;
      });

      flex_text.header.text = "🐺 Role List 🔮";
      flex_text.body.text = roles.join(", ");
      flex_text.body.text +=
        "\n\n" +
        "Cth: '/info vampire-hunter' untuk mengetahui detail role Vampire-Hunter";
      return this.replyFlex(flex_text);
    }

    let roleName = this.args[1].toLowerCase();

    switch (roleName) {
      case "villager":
      case "warga":
        flex_text.header.text = "👨‍🌾 Villager";
        flex_text.body.text += "Type: Town" + "\n\n";
        flex_text.body.text +=
          "Warga biasa yang punya skill sepisial, tak perlu susah payah menggunakan skill pas malam. ";
        flex_text.body.text +=
          "Tapi gak tau kenapa pada kesal dapat role ini. Padahal OP loh";
        break;

      case "seer":
        flex_text.header.text = "🔮 Seer";
        flex_text.body.text += "Type: Town Investigate" + "\n\n";
        flex_text.body.text +=
          "Warga yang bisa mengecek role asli dari suatu player pada malam hari. ";
        break;

      case "doctor":
        flex_text.header.text = "💉 Doctor";
        flex_text.body.text += "Type: Town Protector" + "\n\n";
        flex_text.body.text +=
          "Warga yang bisa memilih siapa yang ingin dilindungi. Dapat melindungi dari serangan biasa atau gigitan vampire. ";
        break;

      case "werewolf":
      case "ww":
        flex_text.header.text = "🐺 Werewolf";
        flex_text.body.text += "Type: Werewolf Killing" + "\n\n";
        flex_text.body.text +=
          "Penjahat yang menyerupai manusia pada siang hari. Yang memberi perintah siapa yang akan dibunuh. ";
        flex_text.body.text =
          "Jika ada Werewolf Cub, maka yang membunuh adalah Werewolf-Cub. ";
        break;

      case "vampire":
        flex_text.header.text = "🧛 Vampire";
        flex_text.body.text += "Type: Neutral Chaos" + "\n\n";
        flex_text.body.text +=
          "Makhluk hidup yang membawa kerusuhan dengan bisa mengubah warga menjadi sejenisnya. ";
        flex_text.body.text +=
          "Menang jika mengubah semua warga menjadi Vampire, atau menggantung penentangnya. ";
        break;

      case "vampire-hunter":
        flex_text.header.text = "🗡️ Vampire-Hunter";
        flex_text.body.text += "Type: Town Killing" + "\n\n";
        flex_text.body.text +=
          "Warga yang berani melawan Vampire, disaat Vampire ke rumahnya, Vampire itu pasti mati. ";
        flex_text.body.text +=
          "Mampu mendengar percakapan Vampire saat malam. ";
        break;

      case "werewolf-cub":
        flex_text.header.text = "🐕 Werewolf-Cub";
        flex_text.body.text += "Type: Werewolf Killing" + "\n\n";
        flex_text.body.text +=
          "Di Pihak werewolf, melakukan pembunuhan atas suruhan Werewolf. Akan menjadi Werewolf jika Werewolf mati. ";
        break;

      case "sorcerer":
        flex_text.header.text = "🧙 Sorcerer";
        flex_text.body.text += "Type: Werewolf Support" + "\n\n";
        flex_text.body.text +=
          "Di Pihak werewolf, bisa menerawang suatu pemain untuk mengetahui rolenya. ";
        break;

      case "consort":
        flex_text.header.text = "🚷 Consort";
        flex_text.body.text += "Type: Werewolf Support" + "\n\n";
        flex_text.body.text +=
          "Di Pihak werewolf, bisa memilih siapa pemain yang ingin di block skillnya. Consort immune dari role block. ";
        flex_text.body.text +=
          "Jika role block Serial-Killer, maka Serial-Killer itu akan ganti target ke orang yang role block";
        break;

      case "vigilante":
        flex_text.header.text = "🔫 Vigilante";
        flex_text.body.text += "Type: Town Killing" + "\n\n";
        flex_text.body.text +=
          "Warga yang bisa memilih siapa yang ingin dibunuh pas malam. ";
        flex_text.body.text +=
          "Tetapi jika dia membunuh sesama warga, dia akan bunuh diri keesokan harinya";
        break;

      case "jester":
        flex_text.header.text = "🃏 Jester";
        flex_text.body.text += "Type: Neutral" + "\n\n";
        flex_text.body.text +=
          "Tidak memihak kesiapa siapa, Jester menang jika di gantung. ";
        flex_text.body.text +=
          "Jika berhasil digantung, dia bisa membalas kematiannya ";
        flex_text.body.text += "dengan menghantui orang lain";
        break;

      case "lookout":
        flex_text.header.text = "👀 Lookout";
        flex_text.body.text += "Type: Town Investigate" + "\n\n";
        flex_text.body.text +=
          "Warga yang bisa memilih rumah siapa yang ingin dipantau pas malam. ";
        flex_text.body.text +=
          "Dia hanya mengetahui siapa nama pendatang targetnya. ";
        break;

      case "escort":
        flex_text.header.text = "💋 Escort";
        flex_text.body.text += "Type: Town Support" + "\n\n";
        flex_text.body.text +=
          "Warga yang bisa ganggu konsentrasi orang lain, sehingga targetnya bisa tidak menggunakan skillnya. ";
        flex_text.body.text +=
          "Namun jika ke rumah Serial Killer, Escort ini bisa dibunuhnya. Escort immune dari role block";
        break;

      case "serial-killer":
        flex_text.header.text = "🔪 Serial Killer";
        flex_text.body.text += "Type: Neutral Killing" + "\n\n";
        flex_text.body.text +=
          "Psikopat yang kebal dari serangan biasa. Hidup hanya untuk membunuh orang lain. ";
        flex_text.body.text +=
          "Kebal dari serangan biasa. Jika di role block, kamu akan bunuh yang ngerole block dan ";
        flex_text.body.text += "mengabaikan target awalmu. ";
        break;

      case "retributionist":
        flex_text.header.text = "⚰️ Retributionist";
        flex_text.body.text += "Type: Town Support" + "\n\n";
        flex_text.body.text +=
          "Warga yang bisa membangkitkan orang mati. Hanya 1 kali saja";
        break;

      case "veteran":
        flex_text.header.text = "🎖️ Veteran";
        flex_text.body.text += "Type: Town Killing" + "\n\n";
        flex_text.body.text +=
          "Warga yang merupakan Veteran perang yang paranoia. ";
        flex_text.body.text +=
          "Mudah terkejut sehingga jika dalam keadaan 'alert', bisa membunuh siapa saja yang kerumahnya. ";
        break;

      case "sheriff":
        flex_text.header.text = "👮 Sheriff";
        flex_text.body.text += "Type: Town Investigate" + "\n\n";
        flex_text.body.text +=
          "Warga yang bisa cek suatu pemain mencurigakan atau tidak. ";
        flex_text.body.text +=
          "Setiap warga akan tampil tidak mencurigakan. Namun role Werewolf, Arsonist, Vampire akan tampil tidak mencurigakan juga. ";
        break;

      case "arsonist":
        flex_text.header.text = "🔥 Arsonist";
        flex_text.body.text += "Type: Neutral Killing" + "\n\n";
        flex_text.body.text +=
          "Maniak api yang hanya ingin semua orang terbakar. ";
        flex_text.body.text +=
          "Arsonist kebal dari serangan biasa saat malam. Pilih diri sendiri jika ingin membakar rumah target yang telah di sirami bensin. ";
        break;

      case "survivor":
        flex_text.header.text = "🏳️ Survivor";
        flex_text.body.text += "Type: Neutral" + "\n\n";
        flex_text.body.text +=
          "Orang yang bisa menang dengan siapa saja, asalkan dia tidak mati hingga akhir game. ";
        break;

      case "executioner":
        flex_text.header.text = "🪓 Executioner";
        flex_text.body.text += "Type: Neutral Chaos" + "\n\n";
        flex_text.body.text +=
          "Pendendam yang ingin targetnya mati di gantung. Jika targetmu mati di serang saat malam, ";
        flex_text.body.text +=
          "maka dia akan menjadi Jester. Targetmu akan selalu di pihak warga dan kamu bisa immune dari serangan biasa";
        break;

      case "spy":
        flex_text.header.text = "🔍 Spy";
        flex_text.body.text += "Type: Town Investigate" + "\n\n";
        flex_text.body.text +=
          "Warga yang bisa menyadap suatu pemain saat malam. Spy bisa tahu apa yang terjadi pada Targetnya. ";
        flex_text.body.text +=
          "Spy juga bisa tahu Werewolf ke rumah siapa saja saat malam. ";
        break;

      case "tracker":
        flex_text.header.text = "👣 Tracker";
        flex_text.body.text += "Type: Town Investigate" + "\n\n";
        flex_text.body.text +=
          "Warga yang bisa melacak suatu pemain untuk diketahui kemana aja Targetnya. ";
        break;

      default:
        let text =
          "💡 Tidak ada ditemukan role '" + this.args[1] + "' pada role list. ";
        text += "Cek daftar role yang ada dengan cmd '/info'";
        return this.replyText(text);
    }

    return this.replyFlex(flex_text);
  },

  /** Command func **/

  commandCommand: function() {
    let text = "";
    let cmds = [
      "/info :  tampilin list command info",
      "/info team : list team yang ada",
      "/info role : list role yang ada",
      "/info type : list type yang ada",
      "/info <nama-role> : deskripsi role tersebut",
      "/info <nama-team> : deskripsi role tersebut",
      "/info <nama-type> : deskripsi role tersebut"
    ];

    cmds.forEach((item, index) => {
      text += "- " + item + "\n";
    });

    let flex_text = {
      header: {
        text: "📚 Daftar Perintah Info"
      },
      body: {
        text: text
      }
    };
    return this.replyFlex(flex_text);
  },

  teamListCommand: function() {
    let roles = require("/app/roles/rolesData").map(role => {
      return role.name;
    });

    flex_text.header.text = "🐺 Role List 🔮";
    flex_text.body.text = roles.join(", ");
    flex_text.body.text +=
      "\n\n" +
      "Cth: '/info vampire-hunter' untuk mengetahui detail role Vampire-Hunter";
    return this.replyFlex(flex_text);
  },

  /** message func **/

  replyText: function(texts) {
    texts = Array.isArray(texts) ? texts : [texts];
    return this.client.replyMessage(
      this.event.replyToken,
      texts.map(text => ({ type: "text", text }))
    );
  },

  replyFlex: function(flex_raws, text_raws) {
    flex_raws = Array.isArray(flex_raws) ? flex_raws : [flex_raws];
    let flex_texts = flex_raws.map(flex_raw => ({
      header: flex_raw.header,
      body: flex_raw.body,
      footer: flex_raw.footer,
      table: flex_raw.table
    }));

    let opt_texts = [];
    if (text_raws) {
      text_raws = Array.isArray(text_raws) ? text_raws : [text_raws];
      opt_texts = text_raws.map(text => {
        return { type: "text", text: text };
      });
    }

    const flex = require("/app/message/flex");
    return flex.receive(this.client, this.event, flex_texts, opt_texts);
  }
};
