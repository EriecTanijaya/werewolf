const client = require("./client");
const flex = require("../message/flex");
const util = require("../util");

const receive = event => {
  this.event = event;

  switch (event.type) {
    case "follow":
      return followResponse();
    case "join":
      return joinResponse();
    case "memberJoined":
      return memberJoinedResponse();
  }
};

const followResponse = () => {
  const flex_text = {
    headerText: "👋 Haiii",
    bodyText:
      "Thanks udah add bot ini 😃, undang bot ini ke group kamu untuk bermain!\n📚 Untuk bantuan bisa ketik '/tutorial' atau '/cmd'"
  };
  return replyFlex(flex_text);
};

const joinResponse = async () => {
  const groupId = util.getGroupId(this.event);
  const isMaintenance = process.env.MAINTENANCE === "true" ? true : false;
  const isTestGroup = groupId === process.env.TEST_GROUP ? true : false;

  if (isMaintenance && !isTestGroup) {
    let text = "👋 Sorry, botnya sedang maintenance. ";
    text += "💡 Untuk info lebih lanjut bisa cek di http://bit.ly/openchatww";
    util.leaveGroup(this.event, groupId, text);
  }

  const membersCount = await getMembersCount(groupId);
  if (!isTestGroup && membersCount < 5) {
    let text =
      "🙏 Maaf, undang kembali jika jumlah member sudah minimal 5 orang. ";
    text += "🌕 Game hanya bisa dimainkan dengan jumlah minimal 5 orang";
    util.leaveGroup(this.event, groupId, text);
  }

  let text = "";

  if (this.event.source.type === "group") {
    let { groupName } = await getGroupData(groupId);
    text = "Thanks udah diundang ke " + groupName + "! ";
  } else {
    text = "Thanks udah diundang ke room ini! ";
  }

  text += "😃 Ketik '/tutorial' atau '/cmd' untuk bantuan. ";
  text += "😕 Jika masih bingung, boleh ke '/forum'";

  let flex_text = {
    headerText: "👋 Hai semua!",
    bodyText: text
  };
  return replyFlex(flex_text);
};

const memberJoinedResponse = async () => {
  const groupId = util.getGroupId(this.event);
  const newMemberId = this.event.joined.members[0].userId;
  let text = "👋 Selamat datang ";

  if (this.event.source.type === "group") {
    let { displayName } = await client.getGroupMemberProfile(
      groupId,
      newMemberId
    );
    text += displayName;

    let { groupName } = await getGroupData(groupId);
    text += " di " + groupName + "!";
  } else if (this.event.source.type === "room") {
    let { displayName } = await client.getRoomMemberProfile(
      groupId,
      newMemberId
    );
    text += displayName;
  }

  return replyText(text);
};

/** helper func **/

const getGroupData = async groupId => {
  const groupData = await client.getGroupSummary(groupId);
  return groupData;
};

const getMembersCount = async groupId => {
  if (this.event.source.type === "group") {
    const { count } = await client.getGroupMembersCount(groupId);
    return count;
  } else {
    const { count } = await client.getRoomMembersCount(groupId);
    return count;
  }
};

/** message func **/

const replyText = texts => {
  texts = Array.isArray(texts) ? texts : [texts];

  const sender = util.getSender();

  let msg = texts.map(text => {
    return {
      sender: sender,
      type: "text",
      text: text.trim()
    };
  });

  return client.replyMessage(this.event.replyToken, msg).catch(err => {
    console.log(
      "err di replyText di other.js",
      err.originalError.response.data
    );
  });
};

const replyFlex = flex_raw => {
  const sender = util.getSender();

  const msg = flex.build(flex_raw, sender);
  return client.replyMessage(this.event.replyToken, msg).catch(err => {
    console.log(JSON.stringify(msg));
    console.error(
      "err replyFlex di other.js",
      err.originalError.response.data.message
    );
  });
};

module.exports = {
  receive
};
