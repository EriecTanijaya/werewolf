const helper = require("/app/helper");

module.exports = {
  receive: function(client, event, args, groupState) {
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

    if (!this.args[1]) {
      return this.commandCommand();
    }

    let cmd = this.args[1].toLowerCase();
    if (cmd === "role") {
      return this.roleListCommand();
    } else if (cmd === "type") {
      return this.roleTypeCommand();
    } else if (cmd === "mode") {
      const roles = require("/app/roles/roleSetInfo");
      return roles.receive(this.client, this.event, this.args, groupState);
    } else {
      let input = "";
      if (this.args[2]) {
        input = helper.parseToText(this.args);
      } else {
        input = this.args[1].replace("-", " ");
      }
      input = input.toLowerCase();

      let rolesData = require("/app/roles/rolesData");

      /// check untuk type
      for (let i = 0; i < rolesData.length; i++) {
        let roleType = rolesData[i].type.toLowerCase();
        if (roleType === input) {
          let listType = this.getListOfType(rolesData[i].type);
          let flex_text = {
            header: {
              text: "🤵 Type " + rolesData[i].type + " 👨‍🌾"
            },
            body: {
              text: listType
            }
          };
          return this.replyFlex(flex_text);
        }
      }

      /// check untuk role
      switch (input) {
        case "werewolf":
        case "ww":
          flex_text.header.text = "🐺 Werewolf";
          flex_text.body.text += "Type: Neutral Killing" + "\n\n";
          flex_text.body.text +=
            "Warga biasa yang bisa berubah menjadi Werewolf pada bulan purnama. ";
          flex_text.body.text +=
            "Bisa RAMPAGE pada rumah target. Yang ke rumah target Werewolf akan diserang juga. ";
          flex_text.body.text +=
            "Werewolf akan tampil tidak bersalah jika di cek pada saat tidak bulan purnama. ";
          flex_text.body.text +=
            "Werewolf immune dari role block dan serangan biasa pada bulan purnama";
          break;

        case "villager":
        case "warga":
          flex_text.header.text = "👨‍🌾 Villager";
          flex_text.body.text += "Type: Town" + "\n\n";
          flex_text.body.text +=
            "Warga biasa yang punya skill sepisial, tak perlu susah payah menggunakan skill pas malam. ";
          flex_text.body.text +=
            "Tapi gak tau kenapa pada kesal dapat role ini. Padahal OP loh";
          break;

        case "investigator":
        case "invest":
          flex_text.header.text = "🕵️ Investigator";
          flex_text.body.text += "Type: Town Investigate" + "\n\n";
          flex_text.body.text +=
            "Warga yang bisa menginvestigasi seorang warga pada malam hari. ";
          flex_text.body.text +=
            "Jika target mu Disguiser, dan Disguiser mengimitasi orang lain, hasil cek mu adalah ";
          flex_text.body.text += "role dari imitasi Disguiser. ";
          break;

        case "doctor":
          flex_text.header.text = "💉 Doctor";
          flex_text.body.text += "Type: Town Protector" + "\n\n";
          flex_text.body.text +=
            "Warga yang bisa memilih siapa yang ingin dilindungi. Dapat melindungi dari serangan biasa atau gigitan Vampire. ";
          flex_text.body.text +=
            "Kamu bisa tahu target mu diserang atau tidak. Skill Heal Doctor tidak bisa menolong ";
          flex_text.body.text +=
            "Vigilante yang akan mati karena bunuh diri, pembakaran Arsonist dan penyerangan Jester. ";
          flex_text.body.text +=
            "Doctor hanya bisa menyembuhkan diri sendiri 1 kali saja. ";
          break;

        case "godfather":
        case "gf":
          flex_text.header.text = "🚬 Godfather";
          flex_text.body.text += "Type: Mafia Killing" + "\n\n";
          flex_text.body.text +=
            "Ketua geng Mafia, yang biasanya berkelompok. ";
          flex_text.body.text +=
            "Jika ada Mafioso, maka yang membunuh adalah Mafioso. Godfather kebal dari serangan biasa. ";
          flex_text.body.text +=
            "Jika Mafioso di block atau tidak ada, Godfather lah yang akan membunuh target";
          break;

        case "vampire":
          flex_text.header.text = "🧛 Vampire";
          flex_text.body.text += "Type: Neutral Chaos" + "\n\n";
          flex_text.body.text +=
            "Makhluk hidup yang membawa kerusuhan dengan bisa mengubah warga menjadi sejenisnya. ";
          flex_text.body.text +=
            "Vampire jika berhasil mengubah seoranga warga menjadi Vampire, akan ada jeda untuk ";
          flex_text.body.text += "menggigit target selanjutnya. ";
          flex_text.body.text +=
            "Jika jumlah Vampire sudah 4 atau lebih, maka Vampire tidak lagi mengubah seorang warga ";
          flex_text.body.text += "warga menjadi Vampire, tetapi menyerangnya. ";
          flex_text.body.text +=
            "Vampire tidak bisa gigit role yang bisa kebal dari serangan biasa. ";
          break;

        case "vh":
        case "vampire hunter":
          flex_text.header.text = "🗡️ Vampire-Hunter";
          flex_text.body.text += "Type: Town Killing" + "\n\n";
          flex_text.body.text +=
            "Warga yang berani melawan Vampire, disaat Vampire ke rumahnya, Vampire itu pasti mati. ";
          flex_text.body.text +=
            "Mampu mendengar percakapan Vampire saat malam. Vampire Hunter akan berubah menjadi Vigilante ";
          flex_text.body.text += "jika semua Vampire telah di basmi";
          break;

        case "mafioso":
          flex_text.header.text = "🔫 Mafioso";
          flex_text.body.text += "Type: Mafia Killing" + "\n\n";
          flex_text.body.text +=
            "Tangan kanan Godfather dalam pembunuhan. Mafioso akan menjadi Godfather jika Godfather yang ada mati. ";
          flex_text.body.text +=
            "Jika Godfather tidak menggunakan skill, maka target yang dituju adalah target Mafioso. ";
          flex_text.body.text +=
            "Namun jika pas malam itu Mafioso di block oleh Escort, maka Mafia tidak jadi membunuh. ";
          break;

        case "consigliere":
        case "consig":
          flex_text.header.text = "✒️ Consigliere";
          flex_text.body.text += "Type: Mafia Support" + "\n\n";
          flex_text.body.text +=
            "Bisa mengecek suatu pemain untuk di ketahui role nya. Consigliere akan berubah menjadi Mafioso jika ";
          flex_text.body.text += "sudah tidak ada Mafia Killing";
          break;

        case "consort":
          flex_text.header.text = "🚷 Consort";
          flex_text.body.text += "Type: Mafia Support" + "\n\n";
          flex_text.body.text +=
            "Bisa block skill suatu pemain. Namun jika Consort nge block Serial Killer, maka Serial Killer akan menyerang Consort ";
          flex_text.body.text +=
            "dan mengabaikan target awalnya. Consort immune dari blocknya Escort. Escort akan berubah menjadi Mafioso ";
          flex_text.body.text += "jika sudah tidak ada Mafia Killing";
          break;

        case "vigi":
        case "vigilante":
          flex_text.header.text = "🔫 Vigilante";
          flex_text.body.text += "Type: Town Killing" + "\n\n";
          flex_text.body.text +=
            "Warga yang bisa menyerang orang lain saat malam. ";
          flex_text.body.text +=
            "Tetapi jika dia membunuh sesama warga, dia akan bunuh diri keesokan harinya. ";
          flex_text.body.text +=
            "Vigilante harus menunggu satu malam untuk menyiapkan senjatanya dan baru bisa menggunakan skill ";
          flex_text.body.text += "keesokkan harinya. ";
          break;

        case "jester":
          flex_text.header.text = "🃏 Jester";
          flex_text.body.text += "Type: Neutral" + "\n\n";
          flex_text.body.text += "Jester menang jika dia berhasil digantung. ";
          flex_text.body.text +=
            "Jika berhasil digantung, dia bisa membalas kematiannya ";
          flex_text.body.text += "dengan menghantui orang lain sampai mati. ";
          flex_text.body.text +=
            "Target yang dihantui Jester tidak dapat diselamatkan oleh apapun. ";
          break;

        case "lookout":
          flex_text.header.text = "👀 Lookout";
          flex_text.body.text += "Type: Town Investigate" + "\n\n";
          flex_text.body.text +=
            "Warga yang bisa memilih rumah siapa yang ingin dipantau pas malam. ";
          flex_text.body.text +=
            "Lookout bisa mengetahui siapa saja pendatang rumah dari target yang dipantau. ";
          break;

        case "escort":
          flex_text.header.text = "💋 Escort";
          flex_text.body.text += "Type: Town Support" + "\n\n";
          flex_text.body.text +=
            "Warga yang bisa block skill orang lain, sehingga targetnya tidak bisa menggunakan skillnya. ";
          flex_text.body.text +=
            "Namun jika ke rumah Serial Killer, Escort ini bisa dibunuhnya dan Serial Killer akan mengabaikan target awalnya. ";
          flex_text.body.text += "Escort juga immune dari role block. ";
          break;

        case "sk":
        case "serial killer":
          flex_text.header.text = "🔪 Serial Killer";
          flex_text.body.text += "Type: Neutral Killing" + "\n\n";
          flex_text.body.text +=
            "Psikopat yang menang jika berhasil membunuh Team yang melawannya. ";
          flex_text.body.text +=
            "Serial Killer kebal dari serangan biasa. Jika di role block, kamu akan bunuh yang ngerole block dan ";
          flex_text.body.text += "mengabaikan target awalmu. ";
          break;

        case "retri":
        case "retributionist":
          flex_text.header.text = "⚰️ Retributionist";
          flex_text.body.text += "Type: Town Support" + "\n\n";
          flex_text.body.text +=
            "Warga yang bisa membangkitkan orang yang sudah mati. Namun kesempatan ini hanya 1 kali saja. ";
          break;

        case "veteran":
          flex_text.header.text = "🎖️ Veteran";
          flex_text.body.text += "Type: Town Killing" + "\n\n";
          flex_text.body.text +=
            "Warga yang merupakan Veteran perang yang paranoia. ";
          flex_text.body.text +=
            "Mudah terkejut sehingga jika dalam keadaan 'alert', bisa membunuh siapa saja yang kerumahnya. ";
          flex_text.body.text +=
            "Veteran immune dari role block Escort atau Consort. ";
          break;

        case "sheriff":
          flex_text.header.text = "👮 Sheriff";
          flex_text.body.text += "Type: Town Investigate" + "\n\n";
          flex_text.body.text +=
            "Warga yang bisa cek suatu pemain mencurigakan atau tidak. ";
          flex_text.body.text +=
            "Setiap warga akan tampil tidak mencurigakan. Namun role Godfather, Arsonist, Vampire, Executioner akan tampil tidak mencurigakan juga. ";
          flex_text.body.text +=
            "Jika target Sheriff di frame, maka akan tampil mencurigakan walaupun tidak. ";
          flex_text.body.text +=
            "Namun jika Disguiser di cek Sheriff, maka akan tampil mencurigakan. Walaupun role imitasi Disguiser adalah warga. ";
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
          flex_text.body.text +=
            "Survivor dibekali 4 vest untuk melindungi diri dari serangan biasa. ";
          break;

        case "exe":
        case "executioner":
          flex_text.header.text = "🪓 Executioner";
          flex_text.body.text += "Type: Neutral Chaos" + "\n\n";
          flex_text.body.text +=
            "Pendendam yang ingin targetnya mati di gantung. Jika targetnya mati di serang saat malam, ";
          flex_text.body.text +=
            "maka dia akan menjadi Jester. Targetnya akan selalu di pihak warga dan dia bisa immune dari serangan biasa. ";
          break;

        case "spy":
          flex_text.header.text = "🔍 Spy";
          flex_text.body.text += "Type: Town Investigate" + "\n\n";
          flex_text.body.text +=
            "Warga yang bisa menyadap suatu pemain saat malam. Spy bisa tahu apa yang terjadi pada Targetnya. ";
          flex_text.body.text +=
            "Spy juga bisa tahu Mafia ke rumah siapa saja saat malam. ";
          break;

        case "tracker":
          flex_text.header.text = "👣 Tracker";
          flex_text.body.text += "Type: Town Investigate" + "\n\n";
          flex_text.body.text +=
            "Warga yang bisa melacak suatu pemain untuk diketahui kemana aja Targetnya. ";
          break;

        case "framer":
          flex_text.header.text = "🎞️ Framer";
          flex_text.body.text += "Type: Mafia Deception" + "\n\n";
          flex_text.body.text +=
            "Anggota Mafia yang bisa membuat suatu pemain tampak bersalah. ";
          flex_text.body.text +=
            "Jika Target Framer di cek Sheriff, maka akan tampak bersalah walaupun ia adalah warga. ";
          break;

        case "disguiser":
          flex_text.header.text = "🎭 Disguiser";
          flex_text.body.text += "Type: Mafia Deception" + "\n\n";
          flex_text.body.text +=
            "Anggota Mafia yang bisa meniru nama role seorang warga. ";
          flex_text.body.text +=
            "Jika Disguiser mati, maka nama role yang ada di daftar pemain adalah nama role warga yang dia imitasi. ";
          flex_text.body.text +=
            "Hasil cek Sheriff akan tetap mencurigakan, sedangkan Investigator hasil terawangnya adalah role yang di imitasi. ";
          flex_text.body.text +=
            "Orang yang di imitasi Disguiser tidak tahu jika dirinya di imitasi. ";
          break;

        case "bodyguard":
          flex_text.header.text = "🛡️ Bodyguard";
          flex_text.body.text += "Type: Town Protector" + "\n\n";
          flex_text.body.text +=
            "Warga yang bisa memilih siapa pemain yang ingin dilindungi. ";
          flex_text.body.text +=
            "Jika Target Bodyguard mau diserang, maka Bodyguard akan melawan balik penyerang tersebut, ";
          flex_text.body.text +=
            "dan penyerang itu akan balik menyerang Bodyguard dan mengabaikan target awalnya. ";
          flex_text.body.text +=
            "Bodyguard memiliki 1 vest yang bisa digunakan untuk melindungi diri sendiri dari serangan biasa. ";
          break;

        case "mayor":
          flex_text.header.text = "🎩 Mayor";
          flex_text.body.text += "Type: Town Support" + "\n\n";
          flex_text.body.text +=
            "Pemimpin warga yang menyamar menjadi warga biasa. Jika Mayor mengungkapkan identitas nya, ";
          flex_text.body.text +=
            "Jumlah vote nya akan terhitung 3, tetapi Doctor tidak bisa heal Mayor yang telah mengungkapkan identitasnya";
          break;

        case "juggernaut":
          flex_text.header.text = "💪 Juggernaut";
          flex_text.body.text += "Type: Neutral Killing" + "\n\n";
          flex_text.body.text +=
            "Seorang kriminal yang kekuatannya makin bertambah tiap kali ia berhasil membunuh. ";
          flex_text.body.text +=
            "Jika berhasil membunuh sekali, dia bisa serang tiap malam. ";
          flex_text.body.text +=
            "Kedua kali, bisa kebal dari serangan biasa. ";
          flex_text.body.text +=
            "Ketiga kali, bisa juga menyerang orang yang kerumah Targetnya. ";
          flex_text.body.text +=
            "Keempat kali, serangannya menembus perlindungan biasa. Tapi Bodyguard tetap bisa membunuhnya. ";
          break;
          
        case "psychic":
          flex_text.header.text = "🔮 Psychic";
          flex_text.body.text += "Type: Town Investigate" + "\n\n";
          flex_text.body.text +=
            "Warga yang setiap malam bisa dapat penglihatan. ";
          flex_text.body.text +=
            "Pada bulan purnama ia dapat penglihatan 2 orang dan salah satu nya adalah orang baik. ";
          flex_text.body.text +=
            "Jika tidak bulan purnama, ia dapat penglihatan 3 orang dan salah satunya adalah orang jahat. ";
          flex_text.body.text +=
          break;

        default:
          let text =
            "💡 Tidak ada ditemukan role '" +
            this.args[1] +
            "' pada role list. ";
          text += "Cek info role yang ada dengan cmd '/info'";
          return this.replyText(text);
      }

      return this.replyFlex(flex_text);
    }
  },

  /** Command func **/

  commandCommand: function() {
    let text = "";
    let cmds = [
      "/info :  tampilin list command info",
      "/info role : list role yang ada",
      "/info type : list type yang ada",
      "/info mode : list mode yang ada",
      "/info <nama-role> : deskripsi role tersebut",
      "/info <nama-type> : deskripsi role tersebut",
      "/info mode <nama-mode> : deskripsi mode tersebut"
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

  roleListCommand: function() {
    let allRoleName = require("/app/roles/rolesData").map(role => {
      return role.name;
    });

    let flex_text = {
      header: {
        text: ""
      },
      body: {
        text: ""
      }
    };

    flex_text.header.text = "🐺 Role List 🔮";
    flex_text.body.text = allRoleName.join(", ");
    flex_text.body.text +=
      "\n\n" +
      "Cth: '/info vampire-hunter' untuk mengetahui detail role Vampire-Hunter";
    return this.replyFlex(flex_text);
  },

  roleTypeCommand: function() {
    let allRoleType = require("/app/roles/rolesData").map(role => {
      return role.type;
    });

    let flex_text = {
      header: {
        text: ""
      },
      body: {
        text: ""
      }
    };

    let uniq = [...new Set(allRoleType)];

    flex_text.header.text = "🐺 Type List 🔮";
    flex_text.body.text = uniq.join(", ");
    flex_text.body.text +=
      "\n\n" +
      "Cth: '/info town-investigate' untuk mengetahui role apa saja yang memiliki type tersebut";
    return this.replyFlex(flex_text);
  },

  /** Helper Func **/
  getListOfType: function(typeName) {
    let rolesData = require("/app/roles/rolesData");
    let selectedType = rolesData
      .filter(role => {
        return typeName === role.type;
      })
      .map(item => {
        return item.name;
      });
    return selectedType.join(", ");
  },

  /** message func **/

  replyText: function(texts) {
    texts = Array.isArray(texts) ? texts : [texts];

    let sender = {
      name: "",
      iconUrl: ""
    };

    let roles = require("/app/roles/rolesData").map(role => {
      let roleName = role.name[0].toUpperCase() + role.name.substring(1);
      return {
        name: roleName,
        iconUrl: role.iconUrl
      };
    });

    let role = helper.random(roles);

    sender.name = role.name;
    sender.iconUrl = role.iconUrl;

    let msg = texts.map(text => {
      return {
        sender: sender,
        type: "text",
        text: text.trim()
      };
    });

    return this.client.replyMessage(this.event.replyToken, msg).catch(err => {
      console.log(
        "err di replyText di rolesInfo.js",
        err.originalError.response.data
      );
    });
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

    let sender = {
      name: "",
      iconUrl: ""
    };

    let roles = require("/app/roles/rolesData").map(role => {
      let roleName = role.name[0].toUpperCase() + role.name.substring(1);
      return {
        name: roleName,
        iconUrl: role.iconUrl
      };
    });

    let role = helper.random(roles);

    sender.name = role.name;
    sender.iconUrl = role.iconUrl;

    const flex = require("/app/message/flex");
    return flex.receive(
      this.client,
      this.event,
      flex_texts,
      opt_texts,
      null,
      null,
      sender
    );
  }
};
