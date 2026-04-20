<template>
  <div
      id="container"
      style="
      width: 80%;
      margin: 5px auto;
      display: flex;
      flex-direction: column;
      height: 500px;
      border: 1px solid #ccc;
      padding: 10px;
      background-color: #f9f9f9;
    "
  >
    <!-- 消息显示区域 -->
    <div
        ref="messagesContainer"
        class="messages-container"
        style="
        flex: 1;
        overflow-y: auto;
        padding-right: 10px;
        margin-bottom: 10px;
      "
    >
      <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['message', msg.isUser ? 'user-message' : 'bot-message']"
      >
        <div :class="msg.isUser ? 'text-right' : 'text-left'">
          <div class="message-bubble">
            {{ msg.text }}
          </div>
        </div>
      </div>
    </div>

    <!-- 输入框和发送按钮 -->
    <div style="display: flex; gap: 10px">
      <input
          v-model="userMessage"
          type="text"
          placeholder="请输入消息"
          @keyup.enter="sendMessage"
          style="
          flex: 1;
          padding: 15px;
          border-radius: 5px;
          border: 1px solid #ccc;
          font-size: 16px;
        "
      />
      <button
          @click="sendMessage"
          style="
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        "
      >
        发送
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userMessage: "", // 用户输入的消息
      messages: [], // 消息记录
      sessionId: "",
    };
  },
  mounted() {
    this.session();
  },
  updated() {
    // 在组件更新后，确保消息容器滚动到底部
    this.scrollToBottom();
  },
  methods: {
    session() {
      this.$axios
          .post(`/chat/session?userId=${localStorage.getItem("username")}`)
          .then((res) => {
            this.sessionId = res.data.msg;
            console.log(res.data.msg);
          })
          .catch((err) => {});
    },
    sendMessage() {
      if (!this.userMessage.trim()) return; // 防止发送空消息
      // 1. 将用户消息添加到消息列表
      this.messages.push({ text: this.userMessage, isUser: true });
      const message = this.userMessage.trim();
      const loading = this.$loading({
        lock: true,
        text: "发送消息中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      this.$axios
          .post(
              `/spark/chat?sessionId=${this.sessionId}&userId=${localStorage.getItem("username")}&message=${message}`
          )
          .then((res) => {
            this.userMessage = ""; // 清空输入框
            console.log(res.data.msg);
            const botResponse = res.data.msg;
            loading.close();
            this.messages.push({ text: botResponse, isUser: false });
          })
          .catch((err) => {});
    },
    scrollToBottom() {
      // 滚动到消息容器的底部
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
  },
};
</script>

<style scoped>
/* 消息容器样式 */
.messages-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message {
  display: flex;
  justify-content: flex-start;
}

/* 用户消息样式 */
.user-message {
  flex-direction: row-reverse; /* 反转方向，让用户消息显示在右边 */
}

.user-message .message-bubble {
  background-color: #007bff;
  color: white;
  text-align: right;
  max-width: 200%;
  padding: 15px;
}

/* 机器人消息样式 */
.bot-message {
  flex-direction: row; /* 让机器人消息显示在左边 */
}

.bot-message .message-bubble {
  background-color: #f1f1f1;
  color: #333;
  text-align: left;
  max-width: 200%;
  padding: 15px;
}

/* 消息气泡的样式 */
.message-bubble {
  display: inline-block;
  border-radius: 15px;
  word-wrap: break-word;
  margin: 5px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

input {
  flex: 1;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
}

/* 用户消息文本的右对齐 */
.text-right {
  text-align: right;
}

/* 机器人消息文本的左对齐 */
.text-left {
  text-align: left;
}
</style>
