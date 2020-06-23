module.exports = {
  response: function(doer, wantBroadcast) {
    let roleName = doer.roleName;
    let targetName = doer.targetName;
    let isChangeTarget = doer.changeTarget;
    let isSelfTarget = doer.selfTarget;
    let text = "";
    let subjectText = "Kamu";

    if (wantBroadcast) {
      subjectText = "Aku";
    }

    switch (roleName) {
      case "godfather":
      case "mafioso":
        if (isChangeTarget) {
          text += `🤵 ${subjectText} berubah pikiran dan memutuskan untuk membunuh ${targetName} saja malam ini`;
        } else {
          text += `🤵 ${subjectText} memilih untuk membunuh ${targetName} malam ini`;
        }
        break;

      case "investigator":
        if (isChangeTarget) {
          text += `🕵️ ${subjectText} berubah pikiran dan berencana untuk menginvestigasi ${targetName} saja malam ini`;
        } else {
          text += `🕵️ ${subjectText} berencana untuk menginvestigasi ${targetName} malam ini`;
        }
        break;

      case "consigliere":
        if (isChangeTarget) {
          text += `✒️ ${subjectText} berubah pikiran dan berencana untuk menginvestigasi ${targetName} saja malam ini`;
        } else {
          text += `✒️ ${subjectText} berencana untuk menginvestigasi ${targetName} malam ini`;
        }
        break;

      case "escort":
      case "consort":
        if (isChangeTarget) {
          text += `🚷 ${subjectText} berubah pikiran dan berencana untuk me-roleblock ${targetName} saja malam ini`;
        } else {
          text += `🚷 ${subjectText} berencana untuk me-roleblock ${targetName} malam ini`;
        }
        break;

      case "vigilante":
        if (isChangeTarget) {
          text += `🔫 ${subjectText} berubah pikiran dan berencana untuk membunuh ${targetName} saja malam ini`;
        } else {
          text += `🔫 ${subjectText} berencana untuk membunuh ${targetName} malam ini`;
        }
        break;

      case "veteran":
        text += `💥 ${subjectText} memutuskan untuk berjaga-jaga di rumah mu`;
        break;

      case "survivor":
        text += `🦺 ${subjectText} memutuskan untuk memakai vest mu`;
        break;

      case "serial-killer":
        if (isChangeTarget) {
          text += `🔪 ${subjectText} berubah pikiran dan berencana untuk membunuh ${targetName} saja malam ini`;
        } else {
          text += `🔪 ${subjectText} berencana untuk membunuh ${targetName} malam ini`;
        }
        break;

      case "arsonist":
        if (isChangeTarget) {
          if (isSelfTarget) {
            text += `🔥 ${subjectText} berubah pikiran dan memutuskan untuk membakar rumah target yang telah disirami bensin`;
          } else {
            text += `🛢️ ${subjectText} berubah pikiran dan memutuskan untuk menyirami rumah ${targetName} dengan bensin`;
          }
        } else {
          if (isSelfTarget) {
            text += `🔥 ${subjectText} memutuskan untuk membakar rumah target yang telah disirami bensin`;
          } else {
            text += `🛢️ ${subjectText} memutuskan untuk menyirami rumah ${targetName} dengan bensin`;
          }
        }
        break;

      case "doctor":
        if (isChangeTarget) {
          if (isSelfTarget) {
            text += `💉 ${subjectText} berubah pikiran dan memutuskan untuk melindungi dirimu sendiri saja malam ini`;
          } else {
            text += `💉 ${subjectText} berubah pikiran dan memutuskan untuk berkunjung ke rumah ${targetName} saja dan merawatnya jika dia terkena serangan`;
          }
        } else {
          if (isSelfTarget) {
            text += `💉 ${subjectText} memutuskan untuk berjaga-jaga dan melindungi dirimu sendiri malam ini`;
          } else {
            text += `💉 ${subjectText} memutuskan untuk berkunjung ke rumah ${targetName} dan merawatnya jika dia terkena serangan`;
          }
        }
        break;

      case "retributionist":
        if (isChangeTarget) {
          text += `⚰️ ${subjectText} berubah pikiran dan memutuskan untuk ke makam ${targetName} saja dan membangkitkan nya dari kematian`;
        } else {
          text += `⚰️ ${subjectText} memutuskan untuk ke makam ${targetName} dan membangkitkan nya dari kematian`;
        }
        break;

      case "vampire":
        if (isChangeTarget) {
          text += `🦇 ${subjectText} berubah pikiran dan memilih ${targetName} saja untuk dijadikan Vampire`;
        } else {
          text += `🦇 ${subjectText} memilih ${targetName} untuk dijadikan Vampire`;
        }
        break;

      case "vampire-hunter":
        if (isChangeTarget) {
          text += `🗡️ ${subjectText} berubah pikiran dan memutuskan untuk cek ${targetName} apakah dia Vampire atau bukan`;
        } else {
          text += `🗡️ ${subjectText} memutuskan untuk cek ${targetName} apakah dia Vampire atau bukan`;
        }
        break;

      case "lookout":
        if (isChangeTarget) {
          text += `👀 ${subjectText} berubah pikiran dan memutuskan untuk mengawasi ${targetName} saja malam ini`;
        } else {
          text += `👀 ${subjectText} memutuskan untuk mengawasi ${targetName} malam ini`;
        }
        break;

      case "sheriff":
        if (isChangeTarget) {
          text += `👮 ${subjectText} berubah pikiran dan memutuskan untuk menginterogasi ${targetName} saja malam ini`;
        } else {
          text += `👮 ${subjectText} memutuskan untuk menginterogasi ${targetName} malam ini`;
        }
        break;

      case "jester":
        if (isChangeTarget) {
          text += `👻 ${subjectText} berubah pikiran dan memutuskan untuk menghantui ${targetName} saja malam ini`;
        } else {
          text += `👻 ${subjectText} memutuskan untuk menghantui ${targetName} malam ini`;
        }
        break;

      case "spy":
        if (isChangeTarget) {
          text += `🔍 ${subjectText} berubah pikiran dan memutuskan untuk menyadap ${targetName} saja malam ini`;
        } else {
          text += `🔍 ${subjectText} memutuskan untuk menyadap ${targetName} malam ini`;
        }
        break;

      case "tracker":
        if (isChangeTarget) {
          text += `👣 ${subjectText} berubah pikiran dan memutuskan untuk melacak ${targetName} saja malam ini`;
        } else {
          text += `👣 ${subjectText} memutuskan untuk melacak ${targetName} malam ini`;
        }
        break;

      case "framer":
        if (isChangeTarget) {
          text += `🎞️ ${subjectText} berubah pikiran dan memutuskan untuk menjebak ${targetName} saja malam ini`;
        } else {
          text += `🎞️ ${subjectText} memutuskan untuk menjebak ${targetName} malam ini`;
        }
        break;

      case "disguiser":
        if (isChangeTarget) {
          text += `🎭 ${subjectText} berubah pikiran dan memutuskan untuk mengimitasi ${targetName} saja malam ini`;
        } else {
          text += `🎭 ${subjectText} memutuskan untuk mengimitasi ${targetName} malam ini`;
        }
        break;

      case "bodyguard":
        if (isChangeTarget) {
          text += `🛡️ ${subjectText} berubah pikiran dan memutuskan untuk melindungi ${targetName} saja malam ini`;
        } else {
          text += `🛡️ ${subjectText} memutuskan untuk melindungi ${targetName} malam ini`;
        }
        break;

      case "werewolf":
        if (isChangeTarget) {
          if (isSelfTarget) {
            text += `🐺 ${subjectText} berubah pikiran dan memutuskan untuk RAMPAGE di rumahmu sendiri`;
          } else {
            text += `🐺 ${subjectText} berubah pikiran dan memutuskan untuk RAMPAGE di rumah ${targetName}`;
          }
        } else {
          if (isSelfTarget) {
            text += `🐺 ${subjectText} memutuskan untuk RAMPAGE di rumahmu sendiri`;
          } else {
            text += `🐺 ${subjectText} memutuskan untuk RAMPAGE di rumah ${targetName}`;
          }
        }
        break;

      case "juggernaut":
        if (isChangeTarget) {
          text += `💪 ${subjectText} berubah pikiran dan memutuskan untuk menyerang ${targetName} saja malam ini`;
        } else {
          text += `💪 ${subjectText} memutuskan untuk menyerang ${targetName} malam ini`;
        }
        break;

      case "amnesiac":
        if (isChangeTarget) {
          text += `🤕 ${subjectText} berubah pikiran dan memutuskan untuk mengingat role ${targetName} saja`;
        } else {
          text += `🤕 ${subjectText} memutuskan untuk mengingat role ${targetName}`;
        }
        break;

      case "guardian-angel":
        text += `⚔️ ${subjectText} memutuskan untuk menjaga ${targetName} malam ini`;
        break;

      case "plaguebearer":
        if (isChangeTarget) {
          text += `☣️ ${subjectText} berubah pikiran dan memutuskan untuk menginfeksi ${targetName} saja malam ini`;
        } else {
          text += `☣️ ${subjectText} memutuskan untuk menginfeksi ${targetName} malam ini`;
        }
        break;

      case "pestilence":
        if (isChangeTarget) {
          text += `☣️ ${subjectText} berubah pikiran dan memutuskan untuk RAMPAGE di rumah ${targetName} saja malam ini`;
        } else {
          text += `☣️ ${subjectText} memutuskan untuk RAMPAGE di rumah ${targetName} malam ini`;
        }
        break;
    }

    return text;
  }
};
