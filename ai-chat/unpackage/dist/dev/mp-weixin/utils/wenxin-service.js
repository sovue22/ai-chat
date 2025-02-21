"use strict";
const common_vendor = require("../common/vendor.js");
const utils_aiConfig = require("./ai-config.js");
class WenxinService {
  constructor() {
    this.accessToken = "";
  }
  // 判断当前运行环境
  getPlatform() {
    return "mp-weixin";
  }
  // 获取基础URL
  getBaseUrl() {
    const platform = this.getPlatform();
    return platform === "h5" ? "/api" : "https://aip.baidubce.com";
  }
  // 获取access_token
  async getAccessToken() {
    try {
      const baseUrl = this.getBaseUrl();
      const url = `${baseUrl}/oauth/2.0/token?grant_type=client_credentials&client_id=${utils_aiConfig.config.API_KEY}&client_secret=${utils_aiConfig.config.SECRET_KEY}`;
      const { data } = await common_vendor.index.request({
        url,
        method: "POST",
        header: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });
      if (data.access_token) {
        this.accessToken = data.access_token;
        return this.accessToken;
      } else {
        throw new Error("获取access_token失败");
      }
    } catch (error) {
      console.error("获取access_token错误:", error);
      throw error;
    }
  }
  // 调用文心一言API
  async chat(messages) {
    try {
      if (!this.accessToken) {
        await this.getAccessToken();
      }
      const baseUrl = this.getBaseUrl();
      const url = `${baseUrl}/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions?access_token=${this.accessToken}`;
      const { data } = await common_vendor.index.request({
        url,
        method: "POST",
        header: {
          "Content-Type": "application/json"
        },
        data: {
          messages
        }
      });
      if (data.error_code) {
        if (data.error_code === 110 || data.error_code === 111) {
          this.accessToken = "";
          return this.chat(messages);
        }
        throw new Error(data.error_msg);
      }
      return data.result;
    } catch (error) {
      console.error("调用文心一言API错误:", error);
      throw error;
    }
  }
}
const wenxinService = new WenxinService();
const chatWithWenxin = (messages) => wenxinService.chat(messages);
exports.chatWithWenxin = chatWithWenxin;
