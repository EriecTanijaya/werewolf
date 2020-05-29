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
          text +=
            "🤵 " +
            subjectText +
            " berubah pikiran dan memutuskan untuk membunuh " +
            targetName +
            " saja malam ini";
        } else {
          text +=
            "🤵 " +
            subjectText +
            " memilih untuk membunuh " +
            targetName +
            " malam ini";
        }
        break;

      case "investigator":
        if (isChangeTarget) {
          text +=
            "🕵️ " +
            subjectText +
            " berubah pikiran dan berencana untuk menginvestigasi " +
            targetName +
            " saja malam ini";
        } else {
          text +=
            "🕵️ " +
            subjectText +
            " berencana untuk menginvestigasi " +
            targetName +
            " malam ini";
        }
        break;

      case "consigliere":
        if (isChangeTarget) {
          text +=
            "✒️ " +
            subjectText +
            " berubah pikiran dan berencana untuk menginvestigasi " +
            targetName +
            " saja malam ini";
        } else {
          text +=
            "✒️ " +
            subjectText +
            " berencana untuk menginvestigasi " +
            targetName +
            " malam ini";
        }
        break;

      case "escort":
      case "consort":
        if (isChangeTarget) {
          text +=
            "🚷 " +
            subjectText +
            " berubah pikiran dan berencana untuk me-roleblock " +
            targetName +
            " saja malam ini";
        } else {
          text +=
            "🚷 " +
            subjectText +
            " berencana untuk me-roleblock " +
            targetName +
            " malam ini";
        }
        break;

      case "vigilante":
        if (isChangeTarget) {
          text +=
            "🔫 " +
            subjectText +
            " berubah pikiran dan berencana untuk membunuh " +
            targetName +
            " saja malam ini";
        } else {
          text +=
            "🔫 " +
            subjectText +
            " berencana untuk membunuh " +
            targetName +
            " malam ini";
        }
        break;

      case "veteran":
        text +=
          "💥 " + subjectText + " memutuskan untuk berjaga-jaga di rumah mu";
        break;

      case "survivor":
        text += "🦺 " + subjectText + " memutuskan untuk memakai Vest mu";
        break;

      case "serial-killer":
        if (isChangeTarget) {
          text +=
            "🔪 " +
            subjectText +
            " berubah pikiran dan berencana untuk membunuh " +
            targetName +
            " saja malam ini";
        } else {
          text +=
            "🔪 " +
            subjectText +
            " berencana untuk membunuh " +
            targetName +
            " malam ini";
        }
        break;

      case "arsonist":
        if (isChangeTarget) {
          if (isSelfTarget) {
            text +=
              "🔥 " +
              subjectText +
              " berubah pikiran dan memutuskan untuk membakar rumah target yg telah disirami bensin";
          } else {
            text +=
              "⛽ " +
              subjectText +
              " berubah pikiran dan memutuskan untuk me nyirami rumah " +
              targetName +
              " saja dengan bensin";
          }
        } else {
          if (isSelfTarget) {
            text +=
              "🔥 " +
              subjectText +
              " memutuskan untuk membakar rumah target yg telah disirami bensin";
          } else {
            text +=
              "⛽ " +
              subjectText +
              " memutuskan untuk me nyirami rumah " +
              targetName +
              " dengan bensin";
          }
        }
        break;

      case "doctor":
        if (isChangeTarget) {
          if (isSelfTarget) {
            text +=
              "💉 " +
              subjectText +
              " berubah pikiran dan memutuskan untuk melindungi diri mu sendiri saja malam ini";
          } else {
            text +=
              "💉 " +
              subjectText +
              " berubah pikiran dan memutuskan untuk berkunjung ke rumah " +
              targetName +
              " saja dan merawatnya jika dia terkena serangan";
          }
        } else {
          if (isSelfTarget) {
            text +=
              "💉 " +
              subjectText +
              " memutuskan untuk berjaga-jaga untuk melindungi diri mu sendiri malam ini";
          } else {
            text +=
              "💉 " +
              subjectText +
              " memutuskan untuk berkunjung ke rumah " +
              targetName +
              " dan merawatnya jika dia terkena serangan";
          }
        }
        break;

      case "retributionist":
        if (isChangeTarget) {
          text +=
            "⚰️ " +
            subjectText +
            " berubah pikiran dan memutuskan untuk ke makam " +
            targetName +
            " saja dan membangkitkan nya dari kematian";
        } else {
          text +=
            "⚰️ " +
            subjectText +
            " memutuskan untuk ke makam " +
            targetName +
            " dan membangkitkan nya dari kematian";
        }
        break;

      case "vampire":
        if (isChangeTarget) {
          text +=
            "🦇 " +
            subjectText +
            " berubah pikiran dan memilih " +
            targetName +
            " saja untuk dijadikan vampire";
        } else {
          text +=
            "🦇 " +
            subjectText +
            " memilih " +
            targetName +
            " untuk dijadikan vampire";
        }
        break;

      case "vampire-hunter":
        if (isChangeTarget) {
          text +=
            "🗡️ " +
            subjectText +
            " berubah pikiran dan memutuskan untuk cek " +
            targetName +
            " apakah dia vampire atau bukan";
        } else {
          text +=
            "🗡️ " +
            subjectText +
            " memutuskan untuk cek " +
            targetName +
            " apakah dia vampire atau bukan";
        }
        break;

      case "lookout":
        if (isChangeTarget) {
          text +=
            "👀 " +
            subjectText +
            " berubah pikiran dan memutuskan untuk mengawasi " +
            targetName +
            " saja malam ini";
        } else {
          text +=
            "👀 " +
            subjectText +
            " memutuskan untuk mengawasi " +
            targetName +
            " malam ini";
        }
        break;

      case "sheriff":
        if (isChangeTarget) {
          text +=
            "👮 " +
            subjectText +
            " berubah pikiran dan memutuskan untuk interogasi " +
            targetName +
            " saja malam ini";
        } else {
          text +=
            "👮 " +
            subjectText +
            " memutuskan untuk interogasi " +
            targetName +
            " malam ini";
        }
        break;

      case "jester":
        if (isChangeTarget) {
          text +=
            "👻 " +
            subjectText +
            " berubah pikiran dan memutuskan untuk menghantui " +
            targetName +
            " saja malam ini";
        } else {
          text +=
            "👻 " +
            subjectText +
            " memutuskan untuk menghantui " +
            targetName +
            " malam ini";
        }
        break;

      case "spy":
        if (isChangeTarget) {
          text +=
            "🔍 " +
            subjectText +
            " berubah pikiran dan memutuskan untuk menyadap " +
            targetName +
            " saja malam ini";
        } else {
          text +=
            "🔍 " +
            subjectText +
            " memutuskan untuk menyadap " +
            targetName +
            " malam ini";
        }
        break;

      case "tracker":
        if (isChangeTarget) {
          text +=
            "👣 " +
            subjectText +
            " berubah pikiran dan memutuskan untuk melacak " +
            targetName +
            " saja malam ini";
        } else {
          text +=
            "👣 " +
            subjectText +
            " memutuskan untuk melacak " +
            targetName +
            " malam ini";
        }
        break;

      case "framer":
        if (isChangeTarget) {
          text +=
            "🎞️ " +
            subjectText +
            " berubah pikiran dan memutuskan untuk menjebak " +
            targetName +
            " saja malam ini";
        } else {
          text +=
            "🎞️ " +
            subjectText +
            " memutuskan untuk menjebak " +
            targetName +
            " malam ini";
        }
        break;

      case "disguiser":
        if (isChangeTarget) {
          text +=
            "🎭 " +
            subjectText +
            " berubah pikiran dan memutuskan untuk mengimitasi " +
            targetName +
            " saja malam ini";
        } else {
          text +=
            "🎭 " +
            subjectText +
            " memutuskan untuk mengimitasi " +
            targetName +
            " malam ini";
        }
        break;

      case "bodyguard":
        if (isChangeTarget) {
          text +=
            "🛡️ " +
            subjectText +
            " berubah pikiran dan memutuskan untuk melindungi " +
            targetName +
            " saja malam ini";
        } else {
          text +=
            "🛡️ " +
            subjectText +
            " memutuskan untuk melindungi " +
            targetName +
            " malam ini";
        }
        break;

      case "werewolf":
        if (isChangeTarget) {
          if (isSelfTarget) {
            text += "🐺 " + subjectText + " berubah pikiran ";
            text += "dan memutuskan untuk RAMPAGE di rumah mu sendiri";
          } else {
            text += "🐺 " + subjectText + " berubah pikiran ";
            text += "dan memutuskan untuk RAMPAGE di rumah " + targetName;
          }
        } else {
          if (isSelfTarget) {
            text += "🐺 " + subjectText;
            text += " memutuskan untuk RAMPAGE di rumah mu sendiri";
          } else {
            text += "🐺 " + subjectText;
            text += " memutuskan untuk RAMPAGE di rumah " + targetName;
          }
        }
        break;
    }

    return text;
  }
};
