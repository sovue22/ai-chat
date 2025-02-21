<template>
  <view :class="['message', message.role]">
    <view class="avatar">
      <image :src="avatarSrc"></image>
    </view>
    <view class="content">
      <text>{{ message.content }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ChatMessage',
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  computed: {
    avatarSrc() {
      return this.message.role === 'user' 
        ? '/static/user-avatar.png' 
        : '/static/ai-avatar.png'
    }
  }
}
</script>

<style scoped>
.message {
  display: flex;
  margin-bottom: 20rpx;
}

.message.user {
  flex-direction: row-reverse;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  margin: 0 20rpx;
}

.avatar image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.content {
  max-width: 70%;
  padding: 20rpx;
  border-radius: 10rpx;
  background-color: #fff;
}

.user .content {
  background-color: #007AFF;
  color: #fff;
}
</style>