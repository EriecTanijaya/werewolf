const data = require("/app/src/data");
const flex = require("/app/message/flex");

module.exports = {
  receive: function(client, event) {
    this.client = client;
    this.event = event;

    let groupId = "";
    if (this.event.source.type === "group") {
      groupId = this.event.source.groupId;
    } else if (this.event.source.type === "room") {
      groupId = this.event.source.roomId;
    }

    switch (this.event.type) {
      case "follow":
        return this.followResponse();
      case "join":
        return this.joinResponse(groupId);
      case "leave":
        return this.leaveResponse(groupId);
      case "memberJoined":
        return this.memberJoinedResponse(groupId);
      case "memberLeft":
        return this.memberLeftResponse();
    }
  },

  memberLeftResponse: function() {
    let userId = this.event.left.members[0].userId;
    data.handleLeftUser(userId);
  },

  followResponse: function() {
    let flex_text = {
      header: {
        text: "👋 Haiii"
      },
      body: {
        text:
          "Thanks udah add bot ini 😃, undang bot ini ke group kamu untuk bermain!\n📚 Untuk bantuan bisa ketik '/help' atau '/cmd'"
      }
    };
    return this.replyFlex(flex_text);
  },

  joinResponse: async function(groupId) {
    let isMaintenance = process.env.MAINTENANCE === "true" ? true : false;
    let isTestGroup = groupId === process.env.TEST_GROUP ? true : false;
    if (isMaintenance && !isTestGroup) {
      let text = "👋 Sorry, botnya sedang maintenance. ";
      text += "💡 Untuk info lebih lanjut bisa cek di http://bit.ly/openchatww";
      return this.client
        .replyMessage(this.event.replyToken, {
          type: "text",
          text: text
        })
        .then(() => {
          if (this.event.source.type === "group") {
            return this.client.leaveGroup(groupId);
          } else {
            return this.client.leaveRoom(groupId);
          }
        });
    }

    let membersCount = await this.getMembersCount(groupId);
    if (!isTestGroup && membersCount < 5) {
      let text =
        "🙏 Maaf, undang kembali jika jumlah member sudah minimal 5 orang. ";
      text += "🌕 Game hanya bisa dimainkan dengan jumlah minimal 5 orang";
      return this.client
        .replyMessage(this.event.replyToken, {
          type: "text",
          text: text
        })
        .then(() => {
          if (this.event.source.type === "group") {
            return this.client.leaveGroup(groupId);
          } else {
            return this.client.leaveRoom(groupId);
          }
        });
    }

    let text = "";

    if (this.event.source.type === "group") {
      let groupSummary = await this.getGroupData(groupId);
      text = "Thanks udah diundang ke " + groupSummary.groupName + "! ";
    } else {
      text = "Thanks udah diundang ke room ini! ";
    }

    text += "😃 Ketik '/tutorial' atau '/cmd' untuk bantuan. ";
    text += "😕 Jika masih bingung, boleh ke '/forum'";

    let flex_text = {
      header: {
        text: "👋 Hai semua!"
      },
      body: {
        text: text
      }
    };
    return this.replyFlex(flex_text);
  },

  leaveResponse: function(groupId) {
    data.resetAllUsers(groupId);
  },

  memberJoinedResponse: async function(groupId) {
    let newMemberId = this.event.joined.members[0].userId;
    let text = "👋 Selamat datang ";

    if (this.event.source.type === "group") {
      let profile = await this.client.getGroupMemberProfile(
        groupId,
        newMemberId
      );
      text += profile.displayName;

      let groupSummary = await this.getGroupData(groupId);
      text += " di " + groupSummary.groupName + "!";
    } else if (this.event.source.type === "room") {
      let profile = await this.client.getRoomMemberProfile(
        groupId,
        newMemberId
      );
      text += profile.displayName;
    }

    return this.replyText(text);
  },

  /** Helper func **/

  getGroupData: async function(groupId) {
    let groupData = await this.client.getGroupSummary(groupId);
    return groupData;
  },

  getMembersCount: async function(groupId) {
    let count = 0;
    if (this.event.source.type === "group") {
      let res = await this.client.getGroupMembersCount(groupId);
      count = res.count;
    } else {
      let res = await this.client.getRoomMembersCount(groupId);
      count = res.count;
    }
    return count;
  },

  /** message func **/

  replyFlex: function(flex_raws) {
    flex_raws = Array.isArray(flex_raws) ? flex_raws : [flex_raws];
    let flex_texts = flex_raws.map(flex_raw => ({
      header: flex_raw.header,
      body: flex_raw.body,
      footer: flex_raw.footer,
      table: flex_raw.table
    }));

    return flex.receive(this.client, this.event, flex_texts, [], null);
  },

  replyText: function(texts) {
    texts = Array.isArray(texts) ? texts : [texts];
    return this.client.replyMessage(
      this.event.replyToken,
      texts.map(text => ({ type: "text", text }))
    );
  }
};
