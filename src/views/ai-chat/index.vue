<template>
  <div class="ai-chat-page">
    <aside class="chat-sidebar">
      <span class="eyebrow">AI Assistant</span>
      <h1>智能备赛</h1>
      <p>围绕选题、商业计划书、答辩路演、评分细则和作品提交提供 AI 辅助建议。</p>
      <div class="assistant-status">
        <span>
          <i class="fas fa-shield-alt"></i>
          API Key 由后端托管
        </span>
        <span>
          <i class="fas fa-database"></i>
          自动保存问答记录
        </span>
      </div>
      <div class="prompt-list">
        <button v-for="item in promptList" :key="item" @click="usePrompt(item)">
          {{ item }}
        </button>
      </div>
    </aside>

    <section class="chat-container">
      <div class="chat-toolbar">
        <div class="context-selectors">
          <label>
            <span>关联项目</span>
            <select v-model="context.projectId">
              <option value="">不关联项目</option>
              <option
                v-for="project in projectOptions"
                :key="project.projectId"
                :value="project.projectId"
              >
                {{ project.projectName }}
              </option>
            </select>
          </label>
          <label>
            <span>关联赛事</span>
            <select v-model="context.competitionId">
              <option value="">不关联赛事</option>
              <option
                v-for="competition in competitionOptions"
                :key="competition.competitionId"
                :value="competition.competitionId"
              >
                {{ competition.title || competition.competitionName }}
              </option>
            </select>
          </label>
        </div>
        <button class="history-btn" @click="getChatHistory" :disabled="historyLoading">
          <i class="fas fa-clock-rotate-left" :class="{ rotating: historyLoading }"></i>
          历史记录
        </button>
      </div>

      <div class="chat-message-list" ref="messageList">
        <div class="welcome-box" v-if="messageList.length === 0">
          <h2>智能备赛助手</h2>
          <p>可以从左侧选择一个常用问题，或关联项目后直接输入你的备赛问题。</p>
        </div>

        <div
          v-for="(msg, index) in messageList"
          :key="`${msg.role}-${index}`"
          class="message-item"
          :class="msg.role === 'user' ? 'user-message' : 'ai-message'"
        >
          <div class="message-avatar">{{ msg.role === 'user' ? '我' : 'AI' }}</div>
          <div class="message-content">
            <template v-if="msg.loading">正在整理建议...</template>
            <template v-else>
              <span v-if="msg.meta" class="message-meta">{{ msg.meta }}</span>
              {{ msg.content }}
            </template>
          </div>
        </div>
      </div>

      <div class="chat-input-box">
        <textarea
          v-model="inputContent"
          placeholder="请输入你的问题，按 Enter 发送，Shift + Enter 换行"
          rows="3"
          @keydown.enter.exact.prevent="sendMessage"
        ></textarea>
        <button class="send-btn" @click="sendMessage" :disabled="!inputContent.trim() || loading">
          {{ loading ? '生成中' : '发送' }}
        </button>
      </div>
    </section>
  </div>
</template>

<script>
import { getCurrentUserId, getResponseData } from '@/utils/competition'

export default {
  name: 'AiChatPage',
  data() {
    return {
      messageList: [],
      inputContent: '',
      loading: false,
      historyLoading: false,
      projectOptions: [],
      competitionOptions: [],
      context: {
        projectId: '',
        competitionId: ''
      },
      promptList: [
        '帮我优化创新创业大赛项目摘要',
        '答辩 PPT 应该包含哪些结构',
        '如何说明项目的创新点和可行性',
        '作品提交前需要检查哪些材料'
      ]
    }
  },
  created() {
    this.getContextOptions()
    this.getChatHistory()
  },
  methods: {
    async getContextOptions() {
      try {
        const res = await this.$http.get('/competition/workbench', {
          params: { userId: getCurrentUserId() }
        })
        const workbench = getResponseData(res, {})
        this.projectOptions = workbench.projects || []
        this.competitionOptions = workbench.competitions || []
      } catch (err) {
        this.projectOptions = []
        this.competitionOptions = []
      }
    },
    async getChatHistory() {
      this.historyLoading = true
      try {
        const res = await this.requestChatHistory()
        const records = getResponseData(res, [])
        this.messageList = records
          .slice()
          .reverse()
          .flatMap(item => [
            {
              role: 'user',
              content: item.question || item.message || item.prompt || item.userMessage || '历史问题',
              meta: this.formatRecordTime(item.createTime)
            },
            {
              role: 'ai',
              content: item.answer || item.aiAnswer || '历史回答暂缺',
              meta: item.model || 'AI'
            }
          ])
        this.scrollToBottom()
      } catch (err) {
        this.messageList = []
      } finally {
        this.historyLoading = false
      }
    },
    async requestChatHistory() {
      try {
        return await this.$http.get('/competition/ai-chat/list/by-user', {
          params: { userId: getCurrentUserId() }
        })
      } catch (err) {
        return this.$http.get('/competition/ai-chat/history', {
          params: { userId: getCurrentUserId() }
        })
      }
    },
    usePrompt(content) {
      this.inputContent = content
    },
    async sendMessage() {
      const content = this.inputContent.trim()
      if (!content) return

      this.messageList.push({ role: 'user', content })
      const aiMessageIndex = this.messageList.length
      this.messageList.push({ role: 'ai', content: '', loading: true })
      this.inputContent = ''
      this.loading = true
      this.scrollToBottom()

      try {
        const res = await this.askBackend(content)
        const answer = getResponseData(res, {})
        this.$set(this.messageList, aiMessageIndex, {
          role: 'ai',
          content: answer.answer || 'AI 已返回结果，但内容为空。',
          loading: false,
          meta: answer.model || 'deepseek-chat'
        })
      } catch (err) {
        this.$set(this.messageList, aiMessageIndex, {
          role: 'ai',
          content: 'AI 接口暂时不可用，请确认后端服务已启动，并已完成后端 AI 配置。',
          loading: false,
          meta: '请求失败'
        })
        this.$message.error('智能备赛接口调用失败')
      } finally {
        this.loading = false
        this.scrollToBottom()
      }
    },
    async askBackend(question) {
      const payload = {
        userId: getCurrentUserId(),
        question,
        projectId: this.context.projectId ? Number(this.context.projectId) : undefined,
        competitionId: this.context.competitionId ? Number(this.context.competitionId) : undefined
      }

      const endpoints = [
        '/competition/ai-chat/ask',
        '/ai-chat/ask',
        '/competition/ai-chat/send',
        '/competition/ai-chat/chat'
      ]

      let lastError = null
      for (const endpoint of endpoints) {
        try {
          return await this.$http.post(endpoint, payload)
        } catch (err) {
          lastError = err
        }
      }
      throw lastError
    },
    formatRecordTime(value) {
      return value ? String(value).slice(0, 16) : ''
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const messageList = this.$refs.messageList
        if (messageList) {
          messageList.scrollTop = messageList.scrollHeight
        }
      })
    }
  }
}
</script>

<style scoped>
.ai-chat-page {
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  gap: 22px;
  max-width: 1320px;
  min-height: calc(100vh - 132px);
  margin: 0 auto;
  padding: 28px 32px 56px;
}
.chat-sidebar,
.chat-container {
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 18px 52px rgba(28, 45, 70, 0.08);
}
.chat-sidebar {
  padding: 28px;
}
.eyebrow {
  color: #0f766e;
  font-size: 13px;
  font-weight: 800;
}
.chat-sidebar h1 {
  margin: 8px 0 12px;
  color: #172033;
  font-size: 36px;
}
.chat-sidebar p {
  color: #64748b;
  line-height: 1.7;
}
.prompt-list {
  display: grid;
  gap: 10px;
  margin-top: 24px;
}
.assistant-status {
  display: grid;
  gap: 10px;
  margin-top: 18px;
}
.assistant-status span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #475569;
  font-size: 13px;
  font-weight: 700;
}
.prompt-list button {
  border: none;
  border-radius: 8px;
  background: #eef6f8;
  color: #0f766e;
  padding: 12px;
  cursor: pointer;
  text-align: left;
  font-weight: 800;
}
.chat-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.chat-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
  border-bottom: 1px solid #edf2f7;
}
.context-selectors {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.context-selectors label {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #475569;
  font-size: 13px;
  font-weight: 800;
}
.context-selectors select {
  min-width: 180px;
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  background: #fff;
  color: #172033;
  padding: 8px 10px;
  outline: none;
}
.history-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  background: #fff;
  color: #172033;
  cursor: pointer;
  font-weight: 800;
}
.history-btn:disabled {
  color: #94a3b8;
  cursor: not-allowed;
}
.chat-message-list {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}
.welcome-box {
  display: grid;
  place-items: center;
  min-height: 340px;
  color: #64748b;
  text-align: center;
}
.welcome-box h2 {
  margin-bottom: 10px;
  color: #172033;
}
.message-item {
  display: flex;
  gap: 14px;
  margin-bottom: 18px;
}
.message-item.user-message {
  flex-direction: row-reverse;
}
.message-avatar {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #172033;
  color: #fff;
  flex-shrink: 0;
  font-weight: 800;
}
.message-item.user-message .message-avatar {
  background: #0f766e;
}
.message-content {
  max-width: 72%;
  padding: 14px 16px;
  border-radius: 8px;
  background: #f4f7fb;
  color: #172033;
  line-height: 1.7;
  white-space: pre-wrap;
}
.message-meta {
  display: block;
  margin-bottom: 6px;
  color: #64748b;
  font-size: 12px;
  font-weight: 800;
}
.message-item.user-message .message-content {
  background: #0f766e;
  color: #fff;
}
.chat-input-box {
  display: flex;
  gap: 14px;
  align-items: flex-end;
  padding: 18px;
  border-top: 1px solid #edf2f7;
}
.chat-input-box textarea {
  flex: 1;
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  padding: 12px 14px;
  resize: none;
  outline: none;
}
.send-btn {
  width: 108px;
  height: 48px;
  border: none;
  border-radius: 8px;
  background: #1d8cf8;
  color: #fff;
  cursor: pointer;
  font-weight: 800;
}
.send-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}
@media (max-width: 980px) {
  .ai-chat-page {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 640px) {
  .ai-chat-page {
    padding: 18px 14px 36px;
  }
  .chat-input-box {
    flex-direction: column;
  }
  .send-btn {
    width: 100%;
  }
  .message-content {
    max-width: 82%;
  }
}

/* Capsule visual pass */
.ai-chat-page {
  max-width: 1320px;
  padding: 104px 32px 72px;
  color: var(--capsule-ink);
  font-family: var(--font-body);
}

.chat-sidebar,
.chat-container,
.welcome-box {
  border: 2px solid var(--capsule-outline);
  border-radius: 32px;
  background: #fff;
  box-shadow: 8px 8px 0 var(--capsule-shadow);
}

.chat-sidebar {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 90% 18%, rgba(160, 108, 232, 0.18), transparent 42%),
    radial-gradient(ellipse at 12% 90%, rgba(196, 217, 78, 0.2), transparent 44%),
    #fff;
}

.chat-sidebar::after {
  content: 'AI';
  position: absolute;
  right: 24px;
  bottom: 22px;
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  border: 2px solid var(--capsule-outline);
  border-radius: 50%;
  background: var(--capsule-yellow);
  color: var(--capsule-ink);
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 800;
  box-shadow: 6px 6px 0 var(--capsule-shadow);
  transform: rotate(-8deg);
}

.eyebrow {
  display: inline-flex;
  padding: 9px 18px;
  border: 2px solid var(--capsule-outline);
  border-radius: 9999px;
  background: var(--capsule-lavender);
  color: var(--capsule-ink);
  box-shadow: 4px 4px 0 var(--capsule-shadow);
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.chat-sidebar h1,
.welcome-box h2 {
  color: var(--capsule-ink);
  font-family: var(--font-display);
  font-weight: 800;
  letter-spacing: 0;
}

.chat-sidebar h1 {
  font-size: 44px;
  line-height: 1.05;
}

.chat-sidebar p,
.welcome-box,
.message-content {
  color: #4a4a4a;
}

.prompt-list button,
.send-btn,
.history-btn,
.message-content,
.message-avatar,
.chat-input-box textarea,
.context-selectors select {
  border: 2px solid var(--capsule-outline);
  border-radius: 28px;
  box-shadow: 4px 4px 0 var(--capsule-shadow);
}

.assistant-status span,
.message-meta {
  color: #4a4a4a;
}

.prompt-list button {
  position: relative;
  z-index: 1;
  background: #fff;
  color: var(--capsule-ink);
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

.prompt-list button:nth-child(1) { background: var(--capsule-peach); }
.prompt-list button:nth-child(2) { background: var(--capsule-sky); }
.prompt-list button:nth-child(3) { background: var(--capsule-mint); }
.prompt-list button:nth-child(4) { background: var(--capsule-lavender); }

.prompt-list button:hover,
.history-btn:hover:not(:disabled),
.send-btn:hover:not(:disabled) {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 var(--capsule-shadow);
}

.chat-toolbar {
  border-bottom: 2px solid var(--capsule-outline);
  background: #fff;
}

.context-selectors label {
  color: var(--capsule-ink);
}

.context-selectors select {
  background: var(--capsule-cream);
  color: var(--capsule-ink);
  font-weight: 800;
}

.history-btn {
  background: var(--capsule-sky);
  color: var(--capsule-ink);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.history-btn:disabled {
  background: #d9d9d2;
  color: #6b6b62;
}

.chat-container {
  background:
    radial-gradient(ellipse at 90% 12%, rgba(139, 180, 247, 0.14), transparent 38%),
    var(--capsule-cream);
}

.welcome-box {
  min-height: 320px;
  background: #fff;
}

.message-avatar {
  background: var(--capsule-lavender);
  color: var(--capsule-ink);
}

.message-item.user-message .message-avatar {
  background: var(--capsule-sky);
  color: var(--capsule-ink);
}

.message-content {
  background: #fff;
  color: var(--capsule-ink);
}

.message-item.user-message .message-content {
  background: var(--capsule-lime);
  color: var(--capsule-ink);
}

.chat-input-box {
  border-top: 2px solid var(--capsule-outline);
  background: #fff;
}

.chat-input-box textarea {
  background: var(--capsule-cream);
  color: var(--capsule-ink);
}

.send-btn {
  background: var(--capsule-sky);
  color: var(--capsule-ink);
}

.send-btn:disabled {
  background: #d9d9d2;
  color: #6b6b62;
  cursor: not-allowed;
}

.rotating {
  animation: rotate 0.8s linear infinite;
}

@keyframes rotate {
  to { transform: rotate(360deg); }
}

@media (max-width: 980px) {
  .ai-chat-page {
    padding: 94px 16px 48px;
  }

  .chat-sidebar::after {
    width: 58px;
    height: 58px;
    font-size: 22px;
  }
}

@media (max-width: 640px) {
  .chat-toolbar,
  .context-selectors,
  .context-selectors label {
    align-items: stretch;
    flex-direction: column;
  }

  .context-selectors select {
    width: 100%;
  }

  .chat-sidebar h1 {
    font-size: 36px;
  }

  .message-content {
    max-width: 82%;
  }
}

/* Glass analytics visual pass */
.ai-chat-page {
  max-width: none;
  min-height: calc(100vh - 76px);
  margin: 0;
  padding: 104px 32px 72px;
  background:
    radial-gradient(ellipse at 16% 12%, rgba(191, 209, 234, 0.28), transparent 34%),
    radial-gradient(ellipse at 86% 18%, rgba(214, 205, 232, 0.24), transparent 34%),
    linear-gradient(135deg, #f4f3ed 0%, #eef2f4 50%, #f7f4ed 100%);
  color: #20232a;
  font-family: var(--font-body);
}

.chat-sidebar,
.chat-container,
.welcome-box {
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.68);
  box-shadow: 0 24px 70px rgba(73, 82, 93, 0.12);
  backdrop-filter: blur(22px) saturate(135%);
}

.chat-sidebar {
  overflow: hidden;
  background:
    radial-gradient(ellipse at 86% 16%, rgba(214, 205, 232, 0.34), transparent 42%),
    radial-gradient(ellipse at 14% 88%, rgba(191, 209, 234, 0.32), transparent 44%),
    rgba(255, 255, 255, 0.72);
}

.chat-sidebar::after {
  content: 'AI';
  position: absolute;
  right: 24px;
  bottom: 24px;
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  border: 1px solid rgba(255, 255, 255, 0.78);
  border-radius: 50%;
  background: rgba(191, 209, 234, 0.82);
  color: #20232a;
  font-family: var(--font-body);
  font-size: 24px;
  font-weight: 800;
  box-shadow: 0 14px 36px rgba(73, 82, 93, 0.14);
  transform: none;
}

.eyebrow {
  display: inline-flex;
  width: max-content;
  margin-bottom: 10px;
  padding: 8px 14px;
  border: 0;
  border-radius: 999px;
  background: rgba(191, 209, 234, 0.72);
  color: #35495d;
  box-shadow: none;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.chat-sidebar h1,
.welcome-box h2 {
  color: #20232a;
  font-family: var(--font-body);
  font-weight: 800;
  letter-spacing: 0;
}

.chat-sidebar h1 {
  font-size: 44px;
  line-height: 1.12;
}

.chat-sidebar p,
.welcome-box,
.message-content,
.assistant-status span,
.message-meta {
  color: #646974;
}

.prompt-list button,
.send-btn,
.history-btn,
.message-content,
.message-avatar,
.chat-input-box textarea,
.context-selectors select {
  border: 1px solid rgba(210, 216, 224, 0.9);
  border-radius: 18px;
  box-shadow: none;
}

.prompt-list button {
  background: rgba(255, 255, 255, 0.76);
  color: #20232a;
}

.prompt-list button:nth-child(1) { background: rgba(232, 199, 174, 0.58); }
.prompt-list button:nth-child(2) { background: rgba(191, 209, 234, 0.66); }
.prompt-list button:nth-child(3) { background: rgba(201, 230, 216, 0.66); }
.prompt-list button:nth-child(4) { background: rgba(214, 205, 232, 0.62); }

.prompt-list button:hover,
.history-btn:hover:not(:disabled),
.send-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 14px 32px rgba(73, 82, 93, 0.12);
}

.chat-container {
  background:
    radial-gradient(ellipse at 92% 12%, rgba(191, 209, 234, 0.2), transparent 38%),
    rgba(255, 255, 255, 0.7);
}

.chat-toolbar,
.chat-input-box {
  border-color: rgba(210, 216, 224, 0.72);
  background: rgba(255, 255, 255, 0.68);
}

.context-selectors label {
  color: #20232a;
}

.context-selectors select,
.chat-input-box textarea {
  background: rgba(255, 255, 255, 0.8);
  color: #20232a;
}

.history-btn,
.send-btn {
  background: #20232a;
  color: #fff;
}

.history-btn:disabled,
.send-btn:disabled {
  background: #d9dfe6;
  color: #6f7681;
}

.welcome-box,
.message-content {
  background: rgba(255, 255, 255, 0.76);
}

.message-avatar {
  background: rgba(214, 205, 232, 0.82);
  color: #20232a;
}

.message-item.user-message .message-avatar {
  background: rgba(191, 209, 234, 0.88);
  color: #20232a;
}

.message-item.user-message .message-content {
  background: rgba(221, 232, 165, 0.68);
  color: #20232a;
}

@media (max-width: 980px) {
  .ai-chat-page {
    padding: 94px 16px 48px;
  }
}
</style>
