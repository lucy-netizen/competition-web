<template>
  <div class="notification-page">
    <div class="page-header">
      <h1>系统通知</h1>
      <button class="read-all-btn" @click="markAllRead">全部已读</button>
    </div>

    <div class="notification-list">
      <div
          v-for="item in notificationList"
          :key="item.notificationId"
          class="notification-item"
          :class="{ unread: !item.isRead }"
      >
        <div class="item-header">
          <h4>{{ item.title }}</h4>
          <span class="time">{{ item.createTime }}</span>
        </div>
        <p class="content">{{ item.content }}</p>
        <div class="item-footer">
          <button v-if="!item.isRead" class="read-btn" @click="markAsRead(item.notificationId)">
            标为已读
          </button>
        </div>
      </div>

      <div v-if="notificationList.length === 0" class="empty-tip">
        暂无系统通知
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotificationPage',
  data() {
    return {
      notificationList: []
    }
  },
  created() {
    this.getNotificationList()
  },
  methods: {
    async getNotificationList() {
      try {
        const userId = 1 // 后续替换为登录用户ID
        const res = await this.$http.get('/competition/notification/list/all', {
          params: { userId }
        })
        if (res.data.code === 200) {
          this.notificationList = res.data.data
        }
      } catch (err) {
        console.error('获取通知列表失败', err)
      }
    },
    async markAsRead(notificationId) {
      try {
        const res = await this.$http.post('/competition/notification/mark-read', null, {
          params: { notificationId }
        })
        if (res.data.code === 200) {
          this.getNotificationList()
        }
      } catch (err) {
        console.error('标为已读失败', err)
      }
    },
    markAllRead() {
      alert('全部已读功能开发中')
    }
  }
}
</script>

<style scoped>
.notification-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
.read-all-btn {
  background: #f5f5f5;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 6px 16px;
  cursor: pointer;
}
.notification-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.notification-item {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s;
}
.notification-item.unread {
  background: #f0f9ff;
  border-left: 4px solid #6F8FA8;
}
.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.item-header h4 {
  margin: 0;
  font-size: 16px;
}
.time {
  font-size: 12px;
  color: #999;
}
.content {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
}
.read-btn {
  background: #6F8FA8;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 4px 12px;
  font-size: 12px;
  cursor: pointer;
}
.empty-tip {
  text-align: center;
  color: #999;
  padding: 40px 0;
}
</style>
