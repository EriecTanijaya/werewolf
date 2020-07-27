const types = {
  "mafia-killing": { name: "🚬 Mafia Killing 🤵", list: [] },
  "neutral-killing": { name: "🔪 Neutral Killing 🔥", list: [] },
  town: { name: "👨‍🌾 Town 👨‍🌾", list: [] },
  "town-investigate": { name: "👮 Town Investigate 👣", list: [] },
  "town-killing": { name: "🔫 Town Killing 🎖️", list: [] },
  "town-support": { name: "⚰️ Town Support 🎩", list: [] },
  "mafia-deception": { name: "🎭 Mafia Deception 🎞️", list: [] },
  "mafia-support": { name: "✒️ Mafia Support 🚷", list: [] },
  "neutral-chaos": { name: "🧛 Neutral Chaos 🪓", list: [] },
  neutral: { name: "🤕 Neutral 🤡", list: [] },
  "town-protector": { name: "🛡️ Town Protector 💉", list: [] }
};

const roles = require("../roles");
Object.keys(roles).forEach(role => {
  Object.keys(types).forEach(roleType => {
    let { name, type } = roles[role].getData();
    let rawType = type
      .split(" ")
      .join("-")
      .toLowerCase();
    if (rawType === roleType) {
      types[roleType].list.push(name);
    }
  });
});

for (let key in types) {
  types[key].list = types[key].list.join(", ");
}

module.exports = types;
