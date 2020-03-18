module.exports = {
  getFlexColor: function() {
    let color = {};
    let today = new Date().getTime();
    let timestamp = {
      dawn: {
        from: 1584464400000,
        to: 1584478799000,
        color: {
          main: "#507260",
          secondary: "#507260",
          background: "#000000",
          text: "#ffffff"
        }
      },
      morning: {
        from: 1584478800000,
        to: 1584496799000
      },
      noon: {
        from: 1584496800000,
        to: 1584518399000,
        // color: { //uda ok
        //   main: "#f8aa27",
        //   secondary: "#f8aa27",
        //   background: "#ffffff",
        //   text: "#263646"
        // }
        color: {
          main: "#507260",
          secondary: "#507260",
          background: "#000000",
          text: "#ffffff"
        }
      },
      evening: {
        from: 1584518400000,
        to: 1584530999000,
        color: {
          main: "#D48166", //udah ok
          secondary: "#D48166",
          background: "#ffffff",
          text: "#263646"
        }
      },
      night: {
        from: 1584531000000,
        to: 1584550799000
      }
    };

    let times = Object.keys(timestamp);

    for (let i = 0; i < times.length; i++) {
      let time = timestamp[times[i]];
      if (today >= time.from && today <= time.to) {
        color = time.color;
        return color;
      }
    }
  },

  getRandomInt: function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  shuffleArray: function(array) {
    // Thanks to
    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  },

  random: function(array) {
    return array[Math.floor(Math.random() * array.length)];
  },

  trueOrFalse: function() {
    let trueOrFalse = this.random([true, false]);
    return trueOrFalse;
  },

  getMostFrequent: function(array) {
    ///source : https://stackoverflow.com/questions/31227687/find-the-most-frequent-item-of-an-array-not-just-strings
    let mf = 1; //default maximum frequency
    let m = 0; //counter
    let item; //to store item with maximum frequency
    let obj = {}; //object to return
    for (
      let i = 0;
      i < array.length;
      i++ //select element (current element)
    ) {
      for (
        let j = i;
        j < array.length;
        j++ //loop through next elements in array to compare calculate frequency of current element
      ) {
        if (array[i] == array[j])
          //see if element occurs again in the array
          m++; //increment counter if it does
        if (mf < m) {
          //compare current items frequency with maximum frequency
          mf = m; //if m>mf store m in mf for upcoming elements
          item = array[i]; // store the current element.
        }
      }
      m = 0; // make counter 0 for next element.
    }

    //jika ada yang sama, maka akan pilih yang di pertama kali diisi di variable 'item'
    obj = {
      index: item,
      count: mf
    };

    return obj;
  }
};
