const helper = require("/app/helper");

module.exports = {
  getResponse: function(args) {
    let invalidText = args.join(" ");
    invalidText = invalidText.substring(1);

    const response = [
      "Kamu kira aku bakal ngerti '" + invalidText + "'? ",
      "Apa sih. ",
      "Gak ngerti aku cmd '" + invalidText + "'. ",
      "Maksudnya " + invalidText + " apaan? ",
      "Au ah gelap. Gak ngerti aku cmd '" + invalidText + "'. ",
      "Tolong ya, aku gak ngerti '" + invalidText + "' artinya apaan. ",
      "I don't what is " + invalidText + " means. ",
      "Aku ga ngerti " + invalidText + ", mungkin yang lain tau. ",
      "Gak paham. "
    ];
    
    let text = helper.random(response);
    text += "Cek daftar perintah yang benar di '/cmd'";
    return text;
  }
};
