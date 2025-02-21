// 保存聊天记录
export function saveChatHistory(chatList, messageHistory) {
  try {
    uni.setStorageSync('chatList', JSON.stringify(chatList));
    uni.setStorageSync('messageHistory', JSON.stringify(messageHistory));
  } catch (e) {
    console.error('保存聊天记录失败:', e);
  }
}

// 读取聊天记录
export function loadChatHistory() {
  try {
    const chatList = JSON.parse(uni.getStorageSync('chatList') || '[]');
    const messageHistory = JSON.parse(uni.getStorageSync('messageHistory') || '[]');
    return { chatList, messageHistory };
  } catch (e) {
    console.error('读取聊天记录失败:', e);
    return { chatList: [], messageHistory: [] };
  }
}