const helper = require("/app/helper");

module.exports = {
  getResponse: function(args) {
    let invalidText = args.join(" ");
    invalidText = invalidText.substring(1);

    const response = [
      "kamu kira aku bakal ngerti '" + invalidText + "'? ",
      "apa sih. ",
      "aku gak ngerti cmd '" + invalidText + "'. ",
      "maksudnya " + invalidText + " apaan? ",
      "au ah gelap. Gak ngerti aku cmd '" + invalidText + "'. ",
      "tolong ya, aku gak ngerti '" + invalidText + "' artinya apaan. ",
      "i don't what is '" + invalidText + "' means. ",
      "aku ga ngerti '" + invalidText + "', mungkin yang lain tau. ",
      "gak paham. "
    ];
    
    let text = helper.random(response);
    text += "Cek daftar perintah yang benar di '/cmd'";
    return text;
  }
};
