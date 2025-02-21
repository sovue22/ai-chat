<template>
  <view class="chat-container">
    <!-- 聊天记录区域 -->
    <scroll-view 
      class="chat-list" 
      scroll-y="true" 
      :scroll-top="scrollTop"
      :scroll-into-view="scrollToView"
      :scroll-with-animation="true"
    >
      <view 
        class="chat-item" 
        v-for="(item, index) in chatList" 
        :key="index"
        :id="'msg-' + index"
      >
        <view :class="['message', item.type === 'user' ? 'user-message' : 'ai-message']">
          <text>{{ item.content }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 输入区域 -->
    <view class="input-area">
      <input 
        class="message-input"
        v-model="inputMessage"
        placeholder="请输入消息"
        @confirm="sendMessage"
      />
      <button class="send-btn" @tap="sendMessage">
		  <svg t="1738750502016" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6665" width="32" height="32"><path d="M512 64C264.576 64 64 264.576 64 512s200.576 448 448 448 448-200.576 448-448S759.424 64 512 64z m214.679 406.679c-12.427 12.428-32.763 12.428-45.191 0L544 333.191V768c0 17.6-14.4 32-32 32s-32-14.4-32-32V333.191L342.511 470.679c-12.427 12.427-32.763 12.427-45.191 0-12.427-12.427-12.427-32.763 0-45.191l190.216-190.216a32.325 32.325 0 0 1 1.784-1.952c6.225-6.225 14.434-9.331 22.639-9.32l0.04-0.001 0.04 0.001c8.205-0.011 16.414 3.095 22.639 9.32a32.026 32.026 0 0 1 1.784 1.952l190.216 190.216c12.429 12.428 12.429 32.764 0.001 45.191z" p-id="6666" fill="#cdcdcd"></path></svg>
	  </button>
    </view>
  </view>
</template>

<script>
import { chatWithWenxin } from '@/utils/wenxin-service';
import { saveChatHistory, loadChatHistory } from '@/utils/storage';


export default {
  data() {
    return {
      chatList: [],
      inputMessage: '',
      scrollTop: 0,
      scrollToView: '',
      messageHistory: []
    }
  },

  onLoad() {
    // 加载历史聊天记录
    const { chatList, messageHistory } = loadChatHistory();
    this.chatList = chatList;
    this.messageHistory = messageHistory;
    
    // 滚动到最新消息
    this.$nextTick(() => {
      this.scrollToBottom();
    });
  },

  methods: {
    async sendMessage() {
      if (!this.inputMessage.trim()) return;
      
      // 添加用户消息
      const userMessage = {
        type: 'user',
        content: this.inputMessage
      };
      this.chatList.push(userMessage);
      
      // 更新对话历史
      this.messageHistory.push({
        role: 'user',
        content: this.inputMessage
      });
      
      // 清空输入框
      this.inputMessage = '';
      
      // 显示AI正在输入
      const loadingMessage = {
        type: 'ai',
        content: '正在思考...'
      };
      this.chatList.push(loadingMessage);
      
      try {
        // 调用文心一言API
        const response = await chatWithWenxin(this.messageHistory);
        
        // 更新对话历史
        this.messageHistory.push({
          role: 'assistant',
          content: response
        });
        
        // 更新AI回复
        this.chatList[this.chatList.length - 1] = {
          type: 'ai',
          content: response
        };

        // 保存聊天记录
        saveChatHistory(this.chatList, this.messageHistory);
      } catch (error) {
        // 处理错误
        this.chatList[this.chatList.length - 1] = {
          type: 'ai',
          content: '抱歉，发生了错误，请稍后重试。'
        };
        
        // 从对话历史中移除失败的用户消息
        this.messageHistory.pop();
      }
      
      // 滚动到最新消息
      this.scrollToBottom();
    },

    scrollToBottom() {
      setTimeout(() => {
        this.scrollToView = `msg-${this.chatList.length - 1}`;
      }, 100);
    }
  }
}
</script>

<style lang="scss">
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
  
  .chat-list {
    flex: 1;
    padding: 20rpx;
  }
  
  .chat-item {
    margin-bottom: 20rpx;
  }
  
  .message {
    max-width: 70%;
    padding: 20rpx;
    border-radius: 10rpx;
    word-break: break-all;
    
    &.user-message {
      background-color: #007AFF;
      color: #fff;
      margin-left: auto;
    }
    
    &.ai-message {
      background-color: #fff;
      color: #333;
    }
  }
  
  .input-area {
    display: flex;
    padding: 20rpx;
    background-color: #fff;
    border-top: 1rpx solid #eee;
    
    .message-input {
      flex: 1;
      height: 80rpx;
      padding: 0 20rpx;
      background-color: #f5f5f5;
      border-radius: 40rpx;
    }
    
    .send-btn {
      margin-left: 20rpx;
      width: 100rpx;
      height: 80rpx;
      line-height: 80rpx;
	  display: flex;
	  justify-content: center;
	  align-items: center;
      background-color: #fff;
      color: #fff;
      border-radius: 20rpx;
      font-size: 16rpx;
    }
  }
}

// 修复按钮默认样式
button {
  margin: 0;
  padding: 0;
  
  &::after {
    border: none;
  }
}

// 适配底部安全区
.input-area {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>