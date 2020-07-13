const types = {
  "Mafia Killing": [],
  "Neutral Killing": [],
  "Town": [],
  "Town Investigate": [],
  "Town Killing": [],
  "Town Support": [],
  "Mafia Deception": [],
  "Mafia Support": [],
  "Neutral Chaos": [],
  "Neutral": [],
  "Town Protector": []
};

const roles = require("../roles");
Object.keys(roles).forEach(role => {
  Object.keys(types).forEach(roleType => {
    let { name, type } = roles[role].getData();
    if (type === roleType) {
      types[type].push(name);
    }
  });
});

for (let key in types) {
  types[key] = types[key].join(", ");
}

module.exports = types;