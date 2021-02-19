const getOnlineUsers = user_sessions => {
  const onlineUsers = [];
  Object.keys(user_sessions).forEach(key => {
    let user = user_sessions[key];
    if (user && user.state === "active") {
      onlineUsers.push(user);
    }
  });
  return onlineUsers;
};

const getOnlineGroups = group_sessions => {
  const onlineGroups = [];
  Object.keys(group_sessions).forEach(key => {
    let group = group_sessions[key];
    if (group && group.state !== "idle") {
      onlineGroups.push(group);
    }
  });
  return onlineGroups;
};

const viewCommand = async (group_sessions, groupIndex) => {
  const groupsData = getOnlineGroups(group_sessions);

  if (groupIndex === undefined) {
    return "masukin index dari group list";
  }

  if (!groupsData.length) return "ga ada group yang online";

  if (!groupsData[groupIndex]) return "invalid, array mulai dari 0";

  const group = groupsData[groupIndex];
  let text = "";

  if (group.name) {
    text += `group name : ${group.name}\n`;
  } else {
    text += `room id : ${group.groupId}`;
  }
  text += `state : ${group.state}\n`;
  text += `time : ${group.time} sec\n`;
  text += `mode : ${group.mode}\n`;
  text += `night count : ${group.nightCounter}\n`;

  if (group.players.length > 0) {
    let num = 1;
    group.players.forEach(item => {
      text += `${num}. ${item.name} - ${item.role.name} (${item.status})\n`;
      num++;
    });
  }

  return text;
};

const insertDevMessage = async (group_sessions, groupIndex, message) => {
  const groupsData = getOnlineGroups(group_sessions);

  if (groupIndex === undefined) {
    return "masukin index dari group list";
  }

  if (!groupsData.length) return "ga ada group yang online";

  if (!groupsData[groupIndex]) return "invalid, array mulai dari 0";

  const group = groupsData[groupIndex];

  const data = {
    message: message,
    timestamp: new Date().getTime()
  };

  group_sessions[group.groupId].dev_messages.push(data);

  return "message sent!";
};

const groupsListCommand = async group_sessions => {
  const groupsData = getOnlineGroups(group_sessions);

  if (!groupsData.length) return "ga ada group yang online";

  let text = `Groups (${groupsData.length}) : \n`;
  let num = 1;
  groupsData.forEach(item => {
    let name = item.name;

    if (!name) {
      let shortRoomId = item.groupId.substr(item.groupId.length - 4);
      name = "Room " + shortRoomId;
    }

    text += `${num}. ${name} (${item.players.length})\n`;
    num++;
  });

  return text;
};

const usersListCommand = async user_sessions => {
  const usersData = getOnlineUsers(user_sessions);

  if (!usersData.length) return "ga ada user yang online";

  let text = `Users (${usersData.length}) : \n`;
  let num = 1;
  usersData.forEach(item => {
    text += `${num}. ${item.name} (${item.groupName})\n`;
    num++;
  });

  return text;
};

const statusCommand = (user_sessions, group_sessions) => {
  let usersOnlineCount = getOnlineUsers(user_sessions).length;
  let groupsOnlineCount = getOnlineGroups(group_sessions).length;

  let statusText = "";

  let userText = "";
  if (usersOnlineCount) {
    userText = "Ada " + usersOnlineCount + " user sedang online";
  } else {
    userText = "Semua user sedang offline";
  }

  let groupText = "";
  if (groupsOnlineCount) {
    groupText = "Ada " + groupsOnlineCount + " group sedang online";
  } else {
    groupText = "Semua group sedang offline";
  }

  if (!groupsOnlineCount && !usersOnlineCount) {
    statusText = "Server nganggur, gak ada yang online";
  } else {
    statusText = userText + "\n\n" + groupText;
  }

  const flex_text = {
    headerText: "🌐 Status",
    bodyText: statusText
  };

  return flex_text;
};

const readUserMessageCommand = async user_sessions => {
  let text = "";
  let hasMessage = false;
  for (let key in user_sessions) {
    if (user_sessions[key] && user_sessions[key].messages.length > 0) {
      hasMessage = true;
      user_sessions[key].messages.forEach(item => {
        const { message, timestamp, groupName } = item;
        const time = new Date(timestamp).toLocaleTimeString("en-US", {
          timeZone: "Asia/Jakarta",
          hour: "2-digit",
          minute: "2-digit"
        });
        text += `[${time}] `;

        if (groupName) {
          text += `[${groupName}] `;
        }

        text += `${user_sessions[key].name}: ${message}\n`;
      });
      user_sessions[key].messages = [];
    }
  }

  if (!hasMessage) {
    return "ga ada pesan";
  }

  return text;
};

module.exports = {
  statusCommand,
  usersListCommand,
  groupsListCommand,
  viewCommand,
  insertDevMessage,
  readUserMessageCommand
};
