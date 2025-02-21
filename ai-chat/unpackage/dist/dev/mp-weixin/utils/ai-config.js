"use strict";
const BASE_URL = "/api";
const config = {
  API_KEY: "KQaNGjrETpn2xqJPDCllA9SN",
  SECRET_KEY: "K3x6bB1O0WJN1dNXt5wAnfHHe7pJqcKP",
  TOKEN_URL: `${BASE_URL}/oauth/2.0/token`,
  CHAT_URL: `${BASE_URL}/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions`
};
exports.config = config;
