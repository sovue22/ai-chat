"use strict";
const utils_wenxinService = require("../../utils/wenxin-service.js");
const utils_storage = require("../../utils/storage.js");
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      chatList: [],
      inputMessage: "",
      scrollTop: 0,
      scrollToView: "",
      messageHistory: []
    };
  },
  onLoad() {
    const { chatList, messageHistory } = utils_storage.loadChatHistory();
    this.chatList = chatList;
    this.messageHistory = messageHistory;
    this.$nextTick(() => {
      this.scrollToBottom();
    });
  },
  methods: {
    async sendMessage() {
      if (!this.inputMessage.trim())
        return;
      const userMessage = {
        type: "user",
        content: this.inputMessage
      };
      this.chatList.push(userMessage);
      this.messageHistory.push({
        role: "user",
        content: this.inputMessage
      });
      this.inputMessage = "";
      const loadingMessage = {
        type: "ai",
        content: "正在思考..."
      };
      this.chatList.push(loadingMessage);
      try {
        const response = await utils_wenxinService.chatWithWenxin(this.messageHistory);
        this.messageHistory.push({
          role: "assistant",
          content: response
        });
        this.chatList[this.chatList.length - 1] = {
          type: "ai",
          content: response
        };
        utils_storage.saveChatHistory(this.chatList, this.messageHistory);
      } catch (error) {
        this.chatList[this.chatList.length - 1] = {
          type: "ai",
          content: "抱歉，发生了错误，请稍后重试。"
        };
        this.messageHistory.pop();
      }
      this.scrollToBottom();
    },
    scrollToBottom() {
      setTimeout(() => {
        this.scrollToView = `msg-${this.chatList.length - 1}`;
      }, 100);
    }
  }
};
if (!Array) {
  const _component_path = common_vendor.resolveComponent("path");
  const _component_svg = common_vendor.resolveComponent("svg");
  (_component_path + _component_svg)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.chatList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.content),
        b: common_vendor.n(item.type === "user" ? "user-message" : "ai-message"),
        c: index,
        d: "msg-" + index
      };
    }),
    b: $data.scrollTop,
    c: $data.scrollToView,
    d: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    e: $data.inputMessage,
    f: common_vendor.o(($event) => $data.inputMessage = $event.detail.value),
    g: common_vendor.p({
      d: "M512 64C264.576 64 64 264.576 64 512s200.576 448 448 448 448-200.576 448-448S759.424 64 512 64z m214.679 406.679c-12.427 12.428-32.763 12.428-45.191 0L544 333.191V768c0 17.6-14.4 32-32 32s-32-14.4-32-32V333.191L342.511 470.679c-12.427 12.427-32.763 12.427-45.191 0-12.427-12.427-12.427-32.763 0-45.191l190.216-190.216a32.325 32.325 0 0 1 1.784-1.952c6.225-6.225 14.434-9.331 22.639-9.32l0.04-0.001 0.04 0.001c8.205-0.011 16.414 3.095 22.639 9.32a32.026 32.026 0 0 1 1.784 1.952l190.216 190.216c12.429 12.428 12.429 32.764 0.001 45.191z",
      ["p-id"]: "6666",
      fill: "#cdcdcd"
    }),
    h: common_vendor.p({
      t: "1738750502016",
      viewBox: "0 0 1024 1024",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      ["p-id"]: "6665",
      width: "32",
      height: "32"
    }),
    i: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
