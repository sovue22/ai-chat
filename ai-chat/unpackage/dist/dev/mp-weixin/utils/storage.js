"use strict";
const common_vendor = require("../common/vendor.js");
function saveChatHistory(chatList, messageHistory) {
  try {
    common_vendor.index.setStorageSync("chatList", JSON.stringify(chatList));
    common_vendor.index.setStorageSync("messageHistory", JSON.stringify(messageHistory));
  } catch (e) {
    console.error("保存聊天记录失败:", e);
  }
}
function loadChatHistory() {
  try {
    const chatList = JSON.parse(common_vendor.index.getStorageSync("chatList") || "[]");
    const messageHistory = JSON.parse(common_vendor.index.getStorageSync("messageHistory") || "[]");
    return { chatList, messageHistory };
  } catch (e) {
    console.error("读取聊天记录失败:", e);
    return { chatList: [], messageHistory: [] };
  }
}
exports.loadChatHistory = loadChatHistory;
exports.saveChatHistory = saveChatHistory;
