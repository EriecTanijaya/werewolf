const userSchema = require("./model");

const add = data => {
  const newUserData = { id: data.id, name: data.name, win: 0, lose: 0, draw: 0 };
  userSchema.create(newUserData, err => {
    if (err) return console.error(err);
  });
};

const update = (id, status, gameMode) => {
  if (gameMode === "custom") return;

  const toIncrease = { $inc: {} };
  toIncrease.$inc[status] = 1;

  userSchema.findOneAndUpdate({ id }, toIncrease, err => {
    if (err) return console.error(err);
  });
};

const getAll = () => {
  return new Promise((resolve, reject) => {
    userSchema.find({}, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};

const getRank = async () => {
  const users = await getAll();
  let data = users.map(item => {
    const totalGame = item.win + item.lose + item.draw;
    let winRate = Math.floor((item.win / totalGame) * 100);
    if (isNaN(winRate)) {
      winRate = 0;
    }

    return {
      name: item.name,
      win: item.win,
      winRate
    };
  });

  data = rank_sort(data);
  data.length = 10;
  data.forEach(item => {
    item.winRate = `${item.winRate}%`;
  });
  return data;
};

const rank_sort = array => {
  //Thanks to
  //https://coderwall.com/p/ebqhca/javascript-sort-by-two-fields

  // descending
  return array.sort((person1, person2) => {
    const person1_winRate = person1.winRate;
    const person2_winRate = person2.winRate;
    return person2.win - person1.win || person2_winRate - person1_winRate;
  });
};

module.exports = {
  add,
  update,
  getRank
};
