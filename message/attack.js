module.exports = {
  /*
    attackersRoleName array
    victimName string
    isDieFromGuilt bool
  */
  getAttackResponse: function(attackersRoleName, victimName, isDieFromGuilt, isAfk) {
    let text = "💀 " + victimName + " ditemukan mati ";

    let attackersCount = attackersRoleName.length;

    if (attackersCount > 1) {
      if (attackersCount > 2) {
        // 3 atau lebih
        text += "dibunuh dengan brutal. ";
      } else {
        // 2
        text += "dibantai. ";
      }
    } else if (attackersCount === 1) {
      // 1
      text += "dibunuh. ";
    } else if (isDieFromGuilt) {
      text += "bunuh diri karena perasaan bersalah. ";
    } else if (isAfk) {
      text += "bunuh diri di rumahnya (AFK). ";
    }

    const capitalize = str => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

    attackersRoleName.forEach(item => {
      switch (item) {
        case "werewolf":
          text += "🐺 Dia sebelumnya diterkam Werewolf. ";
          break;
        case "godfather":
        case "mafioso":
          text += "🤵 Dia sebelumnya dibunuh Mafia. ";
          break;
        case "vigilante":
        case "veteran":
          text += "💥 Dia sebelumnya tertembak " + capitalize(item) + ". ";
          break;
        case "serial-killer":
        case "vampire-hunter":
          text += "🔪 Dia sebelumnya di tikam " + capitalize(item) + ". ";
          break;
        case "arsonist":
          text += "🔥 Dia sebelumnya dibakar Arsonist. ";
          break;
        case "vampire":
          text += "🧛 Dia sebelumnya digigit Vampire. ";
          break;
        case "jester":
          text += "👻 Dia sebelumnya dihantui Jester. ";
          break;
        case "bodyguard":
          text += "🛡️ Dia sebelumnya diserang Bodyguard. ";
          break;
        case "juggernaut":
          text += "💪 Dia sebelumnya diserang Juggernaut. ";
          break;
        case "plaguebearer":
          text += "☣️ Dia sebelumnya mati terinfeksi. ";
          break;
      }
    });

    return text;
  }
};
